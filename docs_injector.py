import os
import re

MODULES_DIR = 'src/main/java/co/edu/sistema_practicas_empresariales/modules'

def generate_javadoc(file_name, class_type):
    name = file_name.replace('.java', '')
    base_name = name.replace('Controller', '').replace('ServiceImpl', '').replace('FacadeImpl', '')
    
    if class_type == 'Controller':
        desc = f"Controlador REST encargado de exponer los endpoints relacionados con la entidad {base_name}.\n * Maneja las peticiones HTTP y orquesta la respuesta delegando la lógica de negocio al servicio o facade correspondiente."
    elif class_type == 'Service':
        desc = f"Servicio de lógica de negocio para la gestión de {base_name}.\n * Implementa las operaciones principales, reglas de negocio y transacciones directamente relacionadas con la base de datos."
    elif class_type == 'Facade':
        desc = f"Fachada (Facade) que orquesta múltiples servicios para cumplir casos de uso complejos de {base_name}.\n * Actúa como intermediario entre los controladores y los servicios subyacentes, ocultando la complejidad del sistema."
    else:
        desc = f"Clase principal para la entidad {base_name}."

    javadoc = f"""/**
 * {desc}
 * 
 * <p>Esta clase ha sido documentada para proveer una comprensión clara
 * de su responsabilidad dentro de la arquitectura del sistema de prácticas empresariales.</p>
 * 
 * @author Equipo de Desarrollo
 * @version 1.0
 */"""
    return javadoc

def process_files():
    processed_count = 0
    for root, dirs, files in os.walk(MODULES_DIR):
        for file in files:
            if file.endswith('Controller.java'):
                class_type = 'Controller'
            elif file.endswith('ServiceImpl.java'):
                class_type = 'Service'
            elif file.endswith('FacadeImpl.java'):
                class_type = 'Facade'
            else:
                continue
            
            filepath = os.path.join(root, file)
            with open(filepath, 'r', encoding='utf-8') as f:
                content = f.read()
            
            # Verificar si ya tiene un Javadoc de clase
            # Buscamos la definición de clase
            class_match = re.search(r'(public\s+class\s+\w+)', content)
            if not class_match:
                continue
            
            class_idx = class_match.start()
            
            # Extraemos lo que hay antes de la clase
            before_class = content[:class_idx]
            
            # Buscamos anotaciones previas a la clase (ej @RestController)
            # Para inyectar el javadoc ANTES de las anotaciones, pero DESPUES de los imports.
            imports_end = before_class.rfind(';')
            
            # Si ya tiene un bloque javadoc justo antes, saltamos
            last_comment_idx = before_class.rfind('/**')
            if last_comment_idx != -1 and last_comment_idx > imports_end:
                continue
            
            javadoc = generate_javadoc(file, class_type)
            
            # Insertar justo después del último import
            if imports_end != -1:
                new_content = content[:imports_end+1] + '\n\n' + javadoc + '\n' + content[imports_end+1:].lstrip()
                with open(filepath, 'w', encoding='utf-8') as f:
                    f.write(new_content)
                processed_count += 1
                
    print(f"Procesados y documentados {processed_count} archivos Java.")

if __name__ == '__main__':
    process_files()
