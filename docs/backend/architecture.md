# Arquitetura Backend - .NET 8 Clean Architecture

## Estrutura de Projetos

```
backend/
├── ERP.API/                          # Camada de Apresentação
│   ├── Controllers/
│   │   ├── AuthController.cs
│   │   ├── ClientesController.cs
│   │   ├── ProdutosController.cs
│   │   ├── PedidosController.cs
│   │   └── DashboardController.cs
│   ├── Middlewares/
│   │   ├── ErrorHandlingMiddleware.cs  # Tratamento global de erros
│   │   └── RequestLoggingMiddleware.cs # Logs de requisições
│   ├── Program.cs
│   └── appsettings.json
│
├── ERP.Application/                  # Camada de Aplicação
│   ├── DTOs/
│   │   ├── ClienteDto.cs
│   │   ├── ProdutoDto.cs
│   │   ├── PedidoDto.cs
│   │   ├── LoginDto.cs
│   │   └── DashboardDto.cs
│   ├── Interfaces/
│   │   ├── IClienteService.cs
│   │   ├── IProdutoService.cs
│   │   ├── IPedidoService.cs
│   │   └── IAuthService.cs
│   ├── Services/
│   │   ├── ClienteService.cs
│   │   ├── ProdutoService.cs
│   │   ├── PedidoService.cs
│   │   └── AuthService.cs
│   ├── Validators/
│   │   ├── ClienteValidator.cs       # FluentValidation
│   │   └── PedidoValidator.cs
│   └── Mappings/
│       └── AutoMapperProfile.cs
│
├── ERP.Domain/                       # Camada de Domínio
│   ├── Entities/
│   │   ├── Cliente.cs
│   │   ├── Produto.cs
│   │   ├── Pedido.cs
│   │   ├── ItemPedido.cs
│   │   └── Usuario.cs
│   ├── Enums/
│   │   └── StatusPedido.cs
│   └── Interfaces/
│       ├── IClienteRepository.cs
│       ├── IProdutoRepository.cs
│       └── IPedidoRepository.cs
│
└── ERP.Infrastructure/               # Camada de Infraestrutura
    ├── Data/
    │   ├── ErpDbContext.cs            # Entity Framework Core
    │   └── DapperContext.cs           # Dapper para queries complexas
    ├── Repositories/
    │   ├── ClienteRepository.cs      # EF Core
    │   ├── ProdutoRepository.cs      # EF Core
    │   ├── PedidoRepository.cs       # EF Core + Dapper (híbrido)
    │   └── DashboardRepository.cs    # Dapper (queries otimizadas)
    └── Configurations/
        ├── ClienteConfiguration.cs   # Fluent API
        └── PedidoConfiguration.cs
```

## Exemplo: Controller com boas práticas

```csharp
[ApiController]
[Route("api/[controller]")]
[Authorize]
public class ClientesController : ControllerBase
{
    private readonly IClienteService _clienteService;
    private readonly ILogger<ClientesController> _logger;

    public ClientesController(
        IClienteService clienteService,
        ILogger<ClientesController> logger)
    {
        _clienteService = clienteService;
        _logger = logger;
    }

    /// <summary>
    /// Retorna lista paginada de clientes com filtro
    /// </summary>
    [HttpGet]
    [ProducesResponseType(typeof(PagedResult<ClienteDto>), 200)]
    public async Task<ActionResult<PagedResult<ClienteDto>>> GetAll(
        [FromQuery] string? termo,
        [FromQuery] int pagina = 1,
        [FromQuery] int tamanhoPagina = 10)
    {
        _logger.LogInformation("Buscando clientes. Termo: {Termo}, Página: {Pagina}", termo, pagina);
        var resultado = await _clienteService.BuscarTodosAsync(termo, pagina, tamanhoPagina);
        return Ok(resultado);
    }

    [HttpGet("{id}")]
    [ProducesResponseType(typeof(ClienteDto), 200)]
    [ProducesResponseType(404)]
    public async Task<ActionResult<ClienteDto>> GetById(int id)
    {
        var cliente = await _clienteService.BuscarPorIdAsync(id);
        if (cliente == null) return NotFound();
        return Ok(cliente);
    }

    [HttpPost]
    [ProducesResponseType(typeof(ClienteDto), 201)]
    [ProducesResponseType(typeof(ValidationProblemDetails), 400)]
    public async Task<ActionResult<ClienteDto>> Create([FromBody] CreateClienteDto dto)
    {
        var cliente = await _clienteService.CriarAsync(dto);
        return CreatedAtAction(nameof(GetById), new { id = cliente.Id }, cliente);
    }

    [HttpPut("{id}")]
    [ProducesResponseType(204)]
    public async Task<IActionResult> Update(int id, [FromBody] UpdateClienteDto dto)
    {
        await _clienteService.AtualizarAsync(id, dto);
        return NoContent();
    }

    [HttpDelete("{id}")]
    [ProducesResponseType(204)]
    public async Task<IActionResult> Delete(int id)
    {
        await _clienteService.DeletarAsync(id);
        return NoContent();
    }
}
```

## Exemplo: Service com validação (FluentValidation)

```csharp
public class ClienteService : IClienteService
{
    private readonly IClienteRepository _repository;
    private readonly IValidator<CreateClienteDto> _validator;
    private readonly IMapper _mapper;

    public ClienteService(
        IClienteRepository repository,
        IValidator<CreateClienteDto> validator,
        IMapper mapper)
    {
        _repository = repository;
        _validator = validator;
        _mapper = mapper;
    }

    public async Task<ClienteDto> CriarAsync(CreateClienteDto dto)
    {
        // Validação com FluentValidation
        var validationResult = await _validator.ValidateAsync(dto);
        if (!validationResult.IsValid)
            throw new ValidationException(validationResult.Errors);

        var entity = _mapper.Map<Cliente>(dto);
        await _repository.AddAsync(entity);
        return _mapper.Map<ClienteDto>(entity);
    }
}
```

## Exemplo: Validator (FluentValidation)

```csharp
public class ClienteValidator : AbstractValidator<CreateClienteDto>
{
    public ClienteValidator()
    {
        RuleFor(x => x.Nome)
            .NotEmpty().WithMessage("Nome é obrigatório")
            .MaximumLength(200).WithMessage("Nome deve ter no máximo 200 caracteres");

        RuleFor(x => x.Email)
            .NotEmpty().WithMessage("E-mail é obrigatório")
            .EmailAddress().WithMessage("E-mail inválido");

        RuleFor(x => x.CpfCnpj)
            .NotEmpty().WithMessage("CPF/CNPJ é obrigatório")
            .Must(BeValidCpfCnpj).WithMessage("CPF/CNPJ inválido");
    }

    private bool BeValidCpfCnpj(string cpfCnpj)
    {
        var cleaned = cpfCnpj?.Replace(".", "").Replace("-", "").Replace("/", "");
        return cleaned?.Length == 11 || cleaned?.Length == 14;
    }
}
```

## Uso Híbrido: EF Core + Dapper

```csharp
// Repository usando EF Core para CRUD
public class ClienteRepository : IClienteRepository
{
    private readonly ErpDbContext _context;

    public async Task<Cliente?> GetByIdAsync(int id)
        => await _context.Clientes.FindAsync(id);

    public async Task AddAsync(Cliente entity)
    {
        _context.Clientes.Add(entity);
        await _context.SaveChangesAsync();
    }
}

// Repository usando Dapper para queries complexas do Dashboard
public class DashboardRepository
{
    private readonly DapperContext _dapper;

    public async Task<DashboardMetricsDto> GetMetricsAsync()
    {
        using var conn = _dapper.CreateConnection();
        
        // Dapper: executa SP para métricas otimizadas
        using var multi = await conn.QueryMultipleAsync(
            "sp_ObterMetricasDashboard", 
            commandType: CommandType.StoredProcedure);
        
        var metricas = await multi.ReadSingleAsync<DashboardMetricsDto>();
        var vendasMes = await multi.ReadAsync<VendaMesDto>();
        var topProdutos = await multi.ReadAsync<TopProdutoDto>();
        
        metricas.VendasPorMes = vendasMes.ToList();
        metricas.TopProdutos = topProdutos.ToList();
        
        return metricas;
    }
}
```

## Middleware de Tratamento de Erros

```csharp
public class ErrorHandlingMiddleware
{
    private readonly RequestDelegate _next;
    private readonly ILogger<ErrorHandlingMiddleware> _logger;

    public async Task InvokeAsync(HttpContext context)
    {
        try
        {
            await _next(context);
        }
        catch (ValidationException ex)
        {
            _logger.LogWarning("Erro de validação: {Errors}", ex.Errors);
            context.Response.StatusCode = 400;
            await context.Response.WriteAsJsonAsync(new { errors = ex.Errors });
        }
        catch (NotFoundException ex)
        {
            context.Response.StatusCode = 404;
            await context.Response.WriteAsJsonAsync(new { message = ex.Message });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Erro interno do servidor");
            context.Response.StatusCode = 500;
            await context.Response.WriteAsJsonAsync(new { message = "Erro interno. Tente novamente." });
        }
    }
}
```
