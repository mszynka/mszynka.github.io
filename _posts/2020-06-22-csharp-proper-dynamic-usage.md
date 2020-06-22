---
title: Dynamic keyword in .NET
tags: [C#, .NET, reflection]
style:
color:
description: Using dynamic keyword with reflected types in .NET - the tricky way.
---
When I started my programming career I often heard that using `dynamic` keyword should be prohibited in the context of field declaration and return types. After many years I've just found out that there is a good reason to use `dynamic` as method return type when using reflection.

## What is dynamic?

As many static typed languages C# requires to define a type for almost everything. Every type must be known at compile time. C# 4 introduces a new type, dynamic. The type is a static type, but an object of type dynamic bypasses static type checking. In most cases, it functions like it has type object. At compile time, an element that is typed as dynamic is assumed to support any operation. The code is valid at runtime, but any unforeseen errors are handled in runtime. When using `System.Reflection` most of the types are `dynamic` until casting occures.

## The problem: finding a implementation

For our problem in question let's imagine we are trying to implement an action handler for any action that is implementing `IAction` interface. We don't want to register handlers for each and every action in one, central module but rather find corresponding type dynamically through reflection mechanizm in .NET. Let's also define our action handler interface as follows: 
```csharp
public interface IActionHandler<in TAction> where TAction : IAction
{
    void Execute(TAction action);
}
```

Let's also assume that our data comes from simple text file so we don't really know what action we are suppose to run until we are at runtime. To initialize action we'll use `Activator.CreateInstance`. That allows us to create an instance of a type dynamically without using the type explicitly, e.g. like in one big switch statement. For using handler there is a static `HandlerProvider` implementation which selects type from correct assembly.

```csharp
public static Type GetHandler<THandler>()
{
    // ReSharper disable once PossibleNullReferenceException
    return Assembly.GetAssembly(typeof(IAction))
        .GetTypes()
        .SingleOrDefault(x => typeof(THandler).IsAssignableFrom(x));
}
```

## Casting action to an interface

Let's try getting handler for our `SampleAction` by casting an action to derived interface. This can be done because `Activator` creates an instance of provided type which is implementing `IAction` interface.

```csharp
private static IAction GetAction()
{
    return (IAction)Activator.CreateInstance(typeof(SampleAction));
}

private static Type GetHandler<TAction>(TAction action)
    where TAction : IAction
{
    return HandlerProvider.GetHandler<IActionHandler<TAction>>();
}
```

In this case we cannot find action handler because provider is looking for generic implementation of `IActionHandler<IAction>` and there isn't any. Through casting dynamic type to implemented interface we have lost irreversibly our original type of `SampleAction`.

## Using dynamic type as method return type

What happens if we switch from casting our `dynamic` type do an interface and just leaving it `dynamic`? Let's change `GetAction` definition to
```csharp
private static dynamic GetAction()
{
    return Activator.CreateInstance(typeof(SampleAction));
}
```

Now we are using dynamic as return type therefore it's not handled as `IAction` but rather as a proper instance of `SampleAction` type. It can be seen while debugging `GetHandler` entry point. .NET actually uses `System.Runtime.CompilerServices` to manage types at runtime so that the type is initialized.

![Debugger Window](/img/articles/2020-06-22-csharp-proper-dynamic-usage.png)

---
You can look at entire code here: [mszynka@github/dynamic-type-checking](https://github.com/mszynka/dynamic-type-checking-in-dotnet)
