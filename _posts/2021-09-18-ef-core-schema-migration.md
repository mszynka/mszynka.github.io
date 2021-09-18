---
title: EntityFramework Core schema migration - case study
tags: [C#, .NET, Entity Framework Core ]
style:
color:
description: Let's generate custom SQL in migrations!
---

Database schema migration solutions are great. They allow for flawless schema integration and validation
while being transparent for developers. The migration mechanisms provided by Entity Framework Core, while not the best, provide a reliable way of managing schema
throughout the project.

There are also times when provided tools are not enough and the conversion layer is not up to task. Sometimes you can write better SQL than those predefined templates can do. Fortunately you can replace or extend those templates with your own. Let's look at this in detail.

## Use case

Let's imagine you have a database and your migrations cannot delete any data table already in existence. Let's also assume that you want to run all migrations at start automatically so in order for your application to work properly is to have all migrations either pass or not fail if schema is already up to task. For simplicity we will use SQLite in this example.

In order to comply with aforementioned requirements we will need to skip creating a table if one already exists. This is not possible with EF Core migration API unless you want to write whole SQL yourself. We will try to use as much of existing API as possible.

## Implementation

At first let's define an extension we will use in migrations. The definition would be basically the same as create table method in EF Core migrator.

```csharp
namespace Gist.Extensions.Sql
{
  public static class MigrationExtensions
  {
    public static CreateTableBuilder<TColumns> CreateTableIfNotExists<TColumns>(
      this MigrationBuilder migrationBuilder,
      [NotNull] string name,
      [NotNull] Func<ColumnsBuilder, TColumns> columns,
      string schema = null,
      Action<CreateTableBuilder<TColumns>> constraints = null,
      string comment = null)
    {
      var createTableOperation = new CreateTableIfNotExistsOperation
      {
        Schema = schema,
        Name = name,
        Comment = comment
      };

      var columnsBuilder = new ColumnsBuilder(createTableOperation);
      var columnsObject = columns(columnsBuilder);
      var columnMap = new Dictionary<PropertyInfo, AddColumnOperation>();
      foreach (var property in typeof(TColumns).GetTypeInfo().DeclaredProperties)
      {
        var addColumnOperation = ((IInfrastructure<AddColumnOperation>)property.GetMethod.Invoke(columnsObject, null))
          .Instance;

        if (addColumnOperation.Name == null)
        {
          addColumnOperation.Name = property.Name;
        }

        columnMap.Add(property, addColumnOperation);
      }

      var builder = new CreateTableBuilder<TColumns>(createTableOperation, columnMap);
      constraints?.Invoke(builder);

      migrationBuilder.Operations.Add(createTableOperation);

      return builder;
    }
  }
}
```

Notice that we initialize custom `CreateTableIfNotExistsOperation` instead of default operation. This will be needed to recognize our custom operation later.

All of the above will not work however because we still need to handle custom operation and generate proper SQL for our sample. To do so we need to override default migrations SQL generator with new handler. One way to do it is to inherit migrations SQL generator that would be selected and override its `Generate` method. We will still use base `Generate` method for standard operations but can implement custom behaviour for our custom operations.

```csharp
namespace Gist.Extensions.Sql
{
  public sealed class CustomMigrationsSqlGenerator : SqliteMigrationsSqlGenerator
  {
    public CustomMigrationsSqlGenerator(
      MigrationsSqlGeneratorDependencies dependencies,
      IRelationalAnnotationProvider migrationsAnnotations)
      : base(dependencies,
        migrationsAnnotations)
    {
    }

    protected override void Generate(
      MigrationOperation operation,
      IModel model,
      MigrationCommandListBuilder builder)
    {
      if (operation is CreateTableIfNotExistsOperation createTableIfNotExistsOperation)
      {
        Generate(createTableIfNotExistsOperation, model, builder);
      }
      else
      {
        base.Generate(operation, model, builder);
      }
    }

    private void Generate(CreateTableIfNotExistsOperation operation, IModel model, MigrationCommandListBuilder builder,
      bool terminate = true)
    {
      builder
        .Append("CREATE TABLE IF NOT EXISTS ")
        .Append(Dependencies.SqlGenerationHelper.DelimitIdentifier(operation.Name, operation.Schema))
        .AppendLine(" (");

      using (builder.Indent())
      {
        CreateTableColumns(operation, model, builder);
        CreateTableConstraints(operation, model, builder);
        builder.AppendLine();
      }

      builder.Append(")");

      if (terminate)
      {
        builder.AppendLine(Dependencies.SqlGenerationHelper.StatementTerminator);
        EndStatement(builder);
      }
    }
  }
}
```

We have all inner workings already done but the framework still does not know to use our custom SQL generator instead of its default. We need to replace `IMigrationsSqlGenerator` service for database context to enable new functionality.

```csharp
namespace Gist.Extensions.Sql
{
  public class GistDbContext : DbContext {
    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder) {
      optionsBuilder
        .UseSqlite($"Data Source={path};")
        .ReplaceService<IMigrationsSqlGenerator, CustomMigrationsSqlGenerator>(); //This line is required
    }
  }  
}
```

## Summary

Using technique showed above we can write almost any custom SQL generator for our migrations without resorting to writing plain SQL migrations every time. We can also fix or alter existing ones if there ever is a problem with them.

## Sources

You can find sources in [this gist](https://gist.github.com/mszynka/4c9de68991080268959d03df26acdeef).

You can also reach me at [LinkedIn](https://pl.linkedin.com/in/maszynka) and [GitHub](https://github.com/mszynka).
