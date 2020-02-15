---
title: C# 8.0
tags: [C#, .NET]
style: border
color: primary
description: I've been using C# 8.0 for a month now and I have completly fell in love with new using declaration for variable scope disposable resources, asynchronous streams and switch expressions. But there is this one tiny thing that I will forever refuse to use...
---

C\# 8.0 had rolled out some time ago but as always between newest tech and production usage there is a bit of a delay. That's why I have not yet tried to summarize perks and benefits of the newest language features. It has already been done by comprehensive documentation by Microsoft finest [docs](https://docs.microsoft.com/en-us/dotnet/csharp/whats-new/csharp-8). I've been using it for a month now and I have completly fell in love with new [using declaration](https://docs.microsoft.com/en-us/dotnet/csharp/whats-new/csharp-8#using-declarations) for variable scope disposable resources, asynchronous streams and [switch expressions](https://docs.microsoft.com/en-us/dotnet/csharp/whats-new/csharp-8#switch-expressions). But there is this one tiny thing that I will forever refuse to use for the sake of clarity and segregation...

## C\# 8.0 interfaces

As many developers already mentioned interfaces have become clumsy and inelegant since version 8.0. First of all let's define what an interface should be and where we could reasonably put the distinction between an interface and abstract class. 

In object-oriented languages where multiple inheritance pattern is present the interface is used to define an abstract type that contains no data but defines behaviour as method signatures thus having no real implementation. Interface is then __implemented__ by concrete or abstract classes. In TypeScript there is language level distinction between implementing and extending types.

Implementing an interface can be done by an abstract or concrete type therefore interface extension is also possible. But an abstract type that is not an interface should not be inherited by multiple types because having default implementations carries a difficulty in distinction between multiple inherited implementations and that's plain chaos.

## Default implementation of interface members

We can already see the tip of the iceberg. Mads Torgersen has already [explained](https://devblogs.microsoft.com/dotnet/default-implementations-in-interfaces/) where you should use default implementation. Let's recap then why we are encouraged to do so. We have an interface `ILogger` with couple of implementations and should we ever add a new member all existing implementations would break.

```csharp
public interface ILogger
{
    void Log(LogLevel level, string message);
    void Log(Exception ex) => Log(LogLevel.Error, ex.ToString());
}
```

Ok, but that default implementation not only cannot have access to private/protected field in existing implementations but also is simply pointless. Can you imagine any proper default implementation other than `throw new NotImplementedException()`? You will now forget to update existing implementations. Why not use interface extension by inheritance? Where we can now put the distinction between `abstract class` and `interface`?

> But wait! There is more!

## Private members

Yes. You heard it right. We can now create interaface with private member. It can obviously not be call from outside. It has to have a default implementation. Is it abstract class already or still an interface? What is really the point of having an interface which is implicitly an abstract class?

## Access modifiers

Adding access modifiers really complicated interfaces a lot. Before 8.0 all members of an interface were public and all unspecified members of class and struct are private by default. That has not changed but let's dive into example explaining visible confusion.

```csharp
public interface IFigure
{
    double Perimeter(); //This is public
}

public class Circle : IFigure
{
    public double R { get; set; }

    double Perimeter() //This is private
    {
        return 2 * 3.14 * R;
    }
}
```

Example above __will raise errors__ caused by incosistent access modifiers in class implementing interface `IFigure` but from contract-implementor standpoint it's clear. We fix that by adding `public` access modifier to method `Perimeter`. But now we can have protected members of interface. Another level of already complicated abstraction to understand.

## Traits

As Microsoft stated in [motivations](https://docs.microsoft.com/en-us/dotnet/csharp/language-reference/proposals/csharp-8.0/default-interface-methods) for proposing default interface methods: "adding default interface implementations provides the elements of the traits language feature". What are traits? For inter-object communication, traits are somewhat between an object-oriented protocol (interface) and a mixin. An interface may define one or more behaviors via method signatures, while a trait defines behaviors via full method definitions: i.e., it includes the body of the methods. In contrast, mixins include full method definitions and may also carry state through member variable, while traits usually don't.

## Remarks

In my opinion it was not necessary to confuse even more interfaces. Let's have in mind that intermediate language level in the form of IL is used to compile C\# code into IL. It would not cost much to introduce new keyword for traits easing the cost of understanding core language features for new developers.

---
References:
- [Microsoft: What's new in C\# 8.0](https://docs.microsoft.com/en-us/dotnet/csharp/whats-new/csharp-8)
- [Mads Torgersen: Default implementation in interfaces](https://devblogs.microsoft.com/dotnet/default-implementations-in-interfaces/)
- [Microsoft: Default interface methods proposals](https://docs.microsoft.com/en-us/dotnet/csharp/language-reference/proposals/csharp-8.0/default-interface-methods)
- [Wikipedia: Trait (Computer programming)](https://en.wikipedia.org/wiki/Trait_(computer_programming))
- [Jeremy Bytes: Interfaces in C# 8 are a Bit of a Mess](https://jeremybytes.blogspot.com/2019/09/interfaces-in-c-8-are-bit-of-mess.html)
- [Jeremy Bytes: A Closer Look at C# 8 Interfaces](https://jeremybytes.blogspot.com/2019/09/a-closer-look-at-c-8-interfaces.html)