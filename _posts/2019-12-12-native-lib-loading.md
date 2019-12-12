---
title: Ultimate P/Invoke hacker tutorial
tags: [C#, .NET, native lib]
style: fill
color: info
description: In the darkest moments of humanity where unmanaged code was the only way and concept of open source was not widespread...
---

If you've never been there I understand. Till today I was not ready to explore the magical yet dangerous world of unmanaged library access from managed code. I can only suppouse that you selected to read this on purpose so prepare to be brain-raped. 

<iframe width="560" height="420" src="http://www.youtube.com/embed/ymZT6QxI8Fc?color=white&theme=light"></iframe>

## P/Invoke - the story unveils

Since the beginning of C++ sideloading unmanaged libraries and unmanaged invocation was expected. We've used some system dll here and some OS window API from another dll. But since I remember .NET was mostly free of that. I have never used or even needed using platform invoke in any task.

"Platform Invoke (or P/Invoke) is a technology that you to access structs, callbacks, and functions in unmanaged libraries from your managed code." [Docs](https://docs.microsoft.com/en-us/dotnet/standard/native-interop/pinvoke) What that means is you can load any dll, define `static extern` definition of function or structure and then invoke like it was a managed resource.

```csharp
[DllImport("somenativelibrary.dll")]
static extern int MethodA([MarshalAs(UnmanagedType.LPStr)] string parameter);
```

Transitioning from managed to native code does require to either use unmanaged types or to transform types between managed and native code via type marshaling process. [Docs](https://docs.microsoft.com/en-us/dotnet/standard/native-interop/type-marshaling) In .NET we can use handy `MarshalAs` attribute on parameters, fields or return values to delegate marshaling process to framework itself.

## Moving between operating systems

So you've used native code in your application. You've deployed your code to a certain configuration. You've checked all dependencies and all is well... as long as native dependencies are a common core for your system branch.

What if after couple years you'd like to change your system version or even use a more `core` image of e.g. Windows? You deploy your application and all seems to function well. But this one invocation causes that mystical `System.DllNotFoundException: Unable to load DLL (HRESULT: 0x8007007E)`. You check if specified dependency is available as dll and you find correct file in correct place.

## Missing dependency hunt

What exactly is given `HRESULT`? I've tried to find a reason but most of the answers were misleading e.g. [this thread](https://stackoverflow.com/questions/9003072/unable-to-load-dll-module-could-not-be-found-hresult-0x8007007e). One of the answers suggested that there may be a certain dependency of native dll missing. In that case `DllNotFoundException` is clearly valid even if it does not state which one is missing.

I've used [Dependency Walker](http://www.dependencywalker.com/) to display all the dependencies of a native library and sure enough there was a certain `.ocx` file that was not on the new hosting OS. OCX is a file extension used by ActiveX forms that are clearly not required for lightweight server OS image.

![DependecyWalker](http://www.dependencywalker.com/snapshot.png)

## Registering ActiveX extensions manually

Providing missing dependency as a binary file is not an option when it comes to ActiveX control files. They must be registered correctly via Microsoft Register Server (`regsvr32.exe`) to be fully functional. After registering it with default *x64* registry server and redeploying I've ended up with `BadImageException` but a by using correct *x86* server application loaded dependency and invoked native methods correctly.

## Remarks

You have survived! Keep in mind that:

1. native dlls can be harmful and has to be handled with care;
2. you can never understand a problem until you explore every option;
3. don't use P/Invoke if you are not writing your own library or you absolutely have to.

---
References:
- [Microsoft Docs: Platform Invoke](https://docs.microsoft.com/en-us/dotnet/standard/native-interop/pinvoke)
- [Microsoft Docs: Type marshaling](https://docs.microsoft.com/en-us/dotnet/standard/native-interop/type-marshaling)
- [StackOverflow: HRESULT: 0x8007007E](https://stackoverflow.com/questions/9003072/unable-to-load-dll-module-could-not-be-found-hresult-0x8007007e)
- [Dependency Walker](http://www.dependencywalker.com/)