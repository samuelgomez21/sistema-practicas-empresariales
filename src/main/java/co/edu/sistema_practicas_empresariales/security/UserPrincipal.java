package co.edu.sistema_practicas_empresariales.security;

import co.edu.sistema_practicas_empresariales.modules.usuario.model.Usuario;
import lombok.AllArgsConstructor;
import lombok.Getter;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import java.util.Collection;
import java.util.List;

@Getter
@AllArgsConstructor
public class UserPrincipal implements UserDetails {

    private final Long id;
    private final String email;
    private final String password;
    private final String nombre;
    private final boolean activo;
    private final Collection<? extends GrantedAuthority> authorities;
    private final transient Usuario usuario; // transient para evitar serialización del objeto de BD si se usa sesión

    public static UserPrincipal create(Usuario usuario) {
        List<GrantedAuthority> authorities = List.of(
            new SimpleGrantedAuthority("ROLE_" + usuario.getRol().getNombre())
        );

        return new UserPrincipal(
            usuario.getId(),
            usuario.getEmail(),
            usuario.getPassword(),
            usuario.getNombre(),
            usuario.isActivo(),
            authorities,
            usuario
        );
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return authorities;
    }

    @Override
    public String getPassword() {
        return password;
    }

    @Override
    public String getUsername() {
        return email;
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return activo;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return activo;
    }
}
