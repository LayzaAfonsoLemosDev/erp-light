# 🔄 Migração: Sistema Legado → Arquitetura Moderna

## Visão Geral

Este documento descreve a evolução do código de um sistema legado (monolítico, acoplado) para uma arquitetura Clean Architecture moderna.

---

## ❌ ANTES: Código Legado

### Problemas identificados:
1. SQL direto nos controllers (SQL Injection vulnerável)
2. Sem separação de camadas
3. Sem validação de dados
4. Connection strings hardcoded
5. Sem tratamento de erros padronizado
6. Sem DTOs (exposição de entidades)

### Exemplo: Controller Legado

```csharp
// ❌ LEGADO - Código acoplado sem separação de responsabilidades
// Arquivo: ClienteController.cs (tudo misturado)

public class ClienteController : Controller
{
    // ❌ Connection string hardcoded
    private string connString = "Server=localhost;Database=ERP;User=sa;Password=123456";

    // ❌ Sem async, sem paginação, sem validação
    public ActionResult Index(string busca)
    {
        var clientes = new List<dynamic>();
        
        // ❌ SQL direto no controller - vulnerável a SQL Injection!
        using (var conn = new SqlConnection(connString))
        {
            conn.Open();
            // ❌ Concatenação de string = SQL Injection
            var sql = "SELECT * FROM Clientes WHERE Nome LIKE '%" + busca + "%'";
            var cmd = new SqlCommand(sql, conn);
            var reader = cmd.ExecuteReader();
            
            while (reader.Read())
            {
                clientes.Add(new {
                    Id = reader["Id"],
                    Nome = reader["Nome"],
                    // ❌ Expondo todas as colunas sem filtro
                });
            }
        }
        
        ViewBag.Clientes = clientes;
        return View(); // ❌ Sem API REST, só MVC
    }

    // ❌ Sem validação, sem transação, sem log
    public ActionResult Salvar(string nome, string email, string cpf)
    {
        using (var conn = new SqlConnection(connString))
        {
            conn.Open();
            // ❌ Mais SQL direto
            var sql = $"INSERT INTO Clientes (Nome, Email, CpfCnpj) VALUES ('{nome}', '{email}', '{cpf}')";
            var cmd = new SqlCommand(sql, conn);
            cmd.ExecuteNonQuery();
        }
        
        return RedirectToAction("Index");
    }
}
```

---

## ✅ DEPOIS: Arquitetura Moderna

### Melhorias implementadas:
1. ✅ Clean Architecture com separação de camadas
2. ✅ Repository Pattern com EF Core (sem SQL direto)
3. ✅ DTOs para controlar dados expostos
4. ✅ FluentValidation para validação robusta
5. ✅ Middleware global de tratamento de erros
6. ✅ Configuração via appsettings.json + User Secrets
7. ✅ Async/Await em todas as operações
8. ✅ API REST com Swagger
9. ✅ Logs estruturados com Serilog

### Controller Moderno

```csharp
// ✅ MODERNO - Controller limpo, só orquestra
[ApiController]
[Route("api/[controller]")]
[Authorize] // ✅ Autenticação JWT
public class ClientesController : ControllerBase
{
    private readonly IClienteService _service; // ✅ Injeção de dependência
    private readonly ILogger<ClientesController> _logger;

    public ClientesController(IClienteService service, ILogger<ClientesController> logger)
    {
        _service = service;
        _logger = logger;
    }

    // ✅ Paginação, filtro, async
    [HttpGet]
    public async Task<ActionResult<PagedResult<ClienteDto>>> GetAll(
        [FromQuery] string? termo,
        [FromQuery] int pagina = 1,
        [FromQuery] int tamanhoPagina = 10)
    {
        _logger.LogInformation("Buscando clientes: {Termo}", termo);
        return Ok(await _service.BuscarTodosAsync(termo, pagina, tamanhoPagina));
    }
}
```

### Service com Validação

```csharp
// ✅ Regras de negócio isoladas no Service
public class ClienteService : IClienteService
{
    private readonly IClienteRepository _repo;
    private readonly IValidator<CreateClienteDto> _validator;
    private readonly IMapper _mapper;

    public async Task<ClienteDto> CriarAsync(CreateClienteDto dto)
    {
        // ✅ Validação com FluentValidation
        var result = await _validator.ValidateAsync(dto);
        if (!result.IsValid)
            throw new ValidationException(result.Errors);

        // ✅ Verificar duplicidade
        if (await _repo.ExisteCpfCnpjAsync(dto.CpfCnpj))
            throw new BusinessException("CPF/CNPJ já cadastrado.");

        var entity = _mapper.Map<Cliente>(dto);
        await _repo.AddAsync(entity);
        
        return _mapper.Map<ClienteDto>(entity);
    }
}
```

### Repository com EF Core

```csharp
// ✅ Acesso a dados isolado, seguro, testável
public class ClienteRepository : IClienteRepository
{
    private readonly ErpDbContext _context;

    // ✅ Paginação com Skip/Take, filtro seguro
    public async Task<PagedResult<Cliente>> BuscarPaginadoAsync(
        string? termo, int pagina, int tamanhoPagina)
    {
        var query = _context.Clientes.AsQueryable();

        if (!string.IsNullOrWhiteSpace(termo))
        {
            // ✅ LINQ - sem SQL Injection
            query = query.Where(c => 
                c.Nome.Contains(termo) || 
                c.Email.Contains(termo));
        }

        var total = await query.CountAsync();
        var items = await query
            .OrderBy(c => c.Nome)
            .Skip((pagina - 1) * tamanhoPagina)
            .Take(tamanhoPagina)
            .ToListAsync();

        return new PagedResult<Cliente>(items, total, pagina, tamanhoPagina);
    }
}
```

---

## 📊 Comparativo

| Aspecto | Legado | Moderno |
|---------|--------|---------|
| Arquitetura | Monolítica | Clean Architecture |
| SQL | Direto no controller | EF Core + Dapper |
| Segurança | SQL Injection vulnerável | Parametrizado |
| Validação | Nenhuma | FluentValidation |
| Erros | Try-catch individual | Middleware global |
| Autenticação | Session-based | JWT |
| API | MVC (HTML) | REST + Swagger |
| Testes | Impossível (acoplado) | Testável (interfaces) |
| Logs | Console.WriteLine | Serilog estruturado |
| Config | Hardcoded | appsettings + Secrets |

---

## 🎯 Lições Aprendidas

1. **Nunca** concatenar strings em SQL
2. **Sempre** separar responsabilidades em camadas
3. **DTOs** protegem dados sensíveis da exposição
4. **Validação** deve ser explícita e documentada
5. **Injeção de dependência** permite testabilidade
6. **Middleware** centraliza tratamento de erros
7. **Repository Pattern** isola o acesso a dados
