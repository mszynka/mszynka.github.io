---
title: XmlWriter forces stream to close
tags: [C#, .NET, XML, Microsoft]
style: fill
color: primary
description: Can you handle your streams correctly? Do you know CQS? Have you considered mixing both?
---

Today a friend showed me a piece of code that was supposed to serialize some `Model` to XML string without any consideration for custom namespaces apart from defined in given Model. Ok, so we need an instance of `XmlSerializer` for `Model`'s type and we will use `XmlWriter` to write through some `MemoryStream` and read the contents at the end. Seems quite obvious therefore he wrote something like this:

```csharp
private static string GetString(Model model)
{
  var serializer = new XmlSerializer(typeof(Model));

  var xmlWriterSettings = new XmlWriterSettings
  {
    CheckCharacters = true,
    CloseOutput = false
  };

  using (var stream = new MemoryStream())
  using (var writer = XmlWriter.Create(stream, xmlWriterSettings))
  using (var reader = new StreamReader(stream))
  {
    serializer.Serialize(writer, model);
    writer.Flush();

    stream.Position = 0;

    return reader.ReadToEnd();
  }
}
```

Then he run the code and he got an Exception:

```csharp
System.ObjectDisposedException: Cannot access a closed Stream.
   at System.IO.MemoryStream.Write(Byte[] buffer, Int32 offset, Int32 count)
   at System.Xml.XmlUtf8RawTextWriter.FlushBuffer()
   at System.Xml.XmlUtf8RawTextWriter.Flush()
   at System.Xml.XmlWellFormedWriter.Close()
   at System.Xml.XmlWriter.Dispose(Boolean disposing)
   at System.Xml.XmlWriter.Dispose()
```

## CQS with streams

At first it looks like there as a bug in .NET because the given solution seems so obvious but look again at above exception stack trace. It is not a problem with reader trying to read closed `Stream`. It is a problem with `MemoryStream.Write` that stumbles across closed stream. The reason for this problem seems to be oddly enough `StreamReader` itself. You want to write and read the same stream in one block and that is not what CQS is telling us to do. Let's break those operations into separate blocks.

```csharp
using (var stream = new MemoryStream())
{
  using (var writer = XmlWriter.Create(stream, xmlWriterSettings))
  {
    serializer.Serialize(writer, model);
  }

  stream.Position = 0;

  using (var reader = new StreamReader(stream))
  {
    return reader.ReadToEnd();
  }
}
```

The Dispose() method invokes Close(), which in turn wants to flush an already closed stream. This looks like a bug since there should be nothing left to flush.

The solution is to not close the `MemoryStream` before the `XmlWriter` disposes.

## Forget the streams

But, you may say, I don't like long code and I am not enforcing using stream to read data from writer in my solution. If so look at this example:

```csharp
private static string GetString(Model model)
{
  var serializer = new XmlSerializer(typeof(Model));

  var xmlWriterSettings = new XmlWriterSettings
  {
    CheckCharacters = true
  };

  using(var sw = new StringWriter())
  using(XmlWriter writer = XmlWriter.Create(sw, xmlWriterSettings))
  {
    serializer.Serialize(writer, model);
    return sw.ToString();
  }
}
```

I've used `StringWriter` that internally writes to `StringBuilder` so it basically converts stream processing into safe string processing and from the very beginning clearly states intention => you want an XML `string` from `Model`.

## Aftermath

At last I will leave you with just couple of thoughts:

1. stream operations are not trivial therefore ask yourself if you really need them,
2. main intent should be easily visible or code smells,
3. let's enjoy that Microsoft has opened .NET sources e.g. [StringBuilder](https://referencesource.microsoft.com/#mscorlib/system/text/stringbuilder.cs) and we can do deep debugging without IL decompiler.

---
References:
- [ReferenceSource: MemoryStream](https://referencesource.microsoft.com/#mscorlib/system/io/memorystream.cs)
- [ReferenceSource: StreamReader](https://referencesource.microsoft.com/#mscorlib/system/io/streamreader.cs)
- [ReferenceSource: StringWriter](https://referencesource.microsoft.com/#mscorlib/system/io/stringwriter.cs)
- [StackOverflow: C# using + XmlWriter.Create = “Cannot access a closed Stream.”](https://stackoverflow.com/questions/5480798/c-sharp-using-xmlwriter-create-cannot-access-a-closed-stream)