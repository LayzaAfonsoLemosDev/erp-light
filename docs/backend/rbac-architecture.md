# 🔐 Arquitetura RBAC - Role-Based Access Control

## Visão Geral

O módulo de controle de acesso implementa RBAC (Role-Based Access Control) com três entidades principais:

```
Usuário → Perfil → Permissões (Módulo + Ação)
```

## Entidades .NET

### User (Usuário)
```csharp
public class User
{
    public int Id { get; set; }
    public string Nome { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string SenhaHash { get; set; } = string.Empty;
    public int PerfilId { get; set; }
    public bool Ativo { get; set; } = true;
    public DateTime DataCriacao { get; set; }
    public DateTime? UltimoAcesso { get; set; }

    // Navigation
    public Role Perfil { get; set; } = null!;
}
```

### Role (Perfil)
```csharp
public class Role
{
    public int Id { get; set; }
    public string Nome { get; set; } = string.Empty;
    public string? Descricao { get; set; }
    public bool Ativo { get; set; } = true;
    
    public ICollection<Permission> Permissoes { get; set; } = new List<Permission>();
    public ICollection<User> Usuarios { get; set; } = new List<User>();
}
```

### Permission (Permissão)
```csharp
public class Permission
{
    public int Id { get; set; }
    public int PerfilId { get; set; }
    public int ModuloId { get; set; }
    public int AcaoId { get; set; }
    
    public Role Perfil { get; set; } = null!;
    public Module Modulo { get; set; } = null!;
    public Action Acao { get; set; } = null!;
}
```

## Endpoints REST

| Método | Rota | Descrição | Perfil |
|--------|------|-----------|--------|
| GET | `/api/usuarios` | Listar usuários (paginado) | Admin |
| GET | `/api/usuarios/{id}` | Detalhes do usuário | Admin |
| POST | `/api/usuarios` | Criar usuário | Admin |
| PUT | `/api/usuarios/{id}` | Editar usuário | Admin |
| PATCH | `/api/usuarios/{id}/status` | Ativar/desativar | Admin |
| GET | `/api/perfis` | Listar perfis | Admin |
| GET | `/api/perfis/{id}` | Detalhes com permissões | Admin |
| POST | `/api/perfis` | Criar perfil | Admin |
| PUT | `/api/perfis/{id}` | Editar perfil e permissões | Admin |

## Middleware de Autorização

```csharp
// Attribute customizado para verificar permissão
[AttributeUsage(AttributeTargets.Method | AttributeTargets.Class)]
public class RequirePermissionAttribute : Attribute, IAuthorizationFilter
{
    private readonly string _modulo;
    private readonly string _acao;

    public RequirePermissionAttribute(string modulo, string acao)
    {
        _modulo = modulo;
        _acao = acao;
    }

    public void OnAuthorization(AuthorizationFilterContext context)
    {
        var userId = context.HttpContext.User.FindFirst("userId")?.Value;
        var permissionService = context.HttpContext.RequestServices
            .GetRequiredService<IPermissionService>();
        
        if (!permissionService.HasPermission(int.Parse(userId!), _modulo, _acao))
        {
            context.Result = new ForbidResult();
        }
    }
}

// Uso no Controller:
[HttpGet]
[RequirePermission("clientes", "visualizar")]
public async Task<IActionResult> GetClientes([FromQuery] PaginationDto pagination)
{
    var result = await _clienteService.GetAllAsync(pagination);
    return Ok(result);
}
```

## Fluxo de Autenticação + Autorização

1. **Login** → Valida credenciais → Gera JWT com `userId` e `perfilId`
2. **Request** → Middleware extrai JWT → Verifica expiração
3. **Autorização** → `RequirePermission` consulta `sp_VerificarPermissao`
4. **Resposta** → 200 OK ou 403 Forbidden

## Service Layer

```csharp
public class PermissionService : IPermissionService
{
    private readonly IPermissionRepository _repo;
    private readonly IMemoryCache _cache;

    public bool HasPermission(int userId, string modulo, string acao)
    {
        var cacheKey = $"perm:{userId}:{modulo}:{acao}";
        return _cache.GetOrCreate(cacheKey, entry =>
        {
            entry.AbsoluteExpirationRelativeToNow = TimeSpan.FromMinutes(5);
            return _repo.VerificarPermissao(userId, modulo, acao);
        });
    }
}
```

## Segurança

- Senhas armazenadas com **BCrypt** (cost factor 12)
- JWT com expiração de 8 horas
- Refresh token com rotação
- Rate limiting no endpoint de login
- Logs de auditoria para alterações em permissões
