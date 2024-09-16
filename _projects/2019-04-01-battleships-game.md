---
name: Battleships game
tools: [C# .NET]
image: https://github.com/mszynka/battleships/raw/master/screenshot.png
description: Simple version of the game Battleships allowing a single human player to play a one-sided game of Battleships against ships placed by the computer.
layout: page
---

# Battleships

Simple version of the game Battleships allowing a single human player to play a one-sided game of Battleships against ships placed by the computer.

[GitHub](https://github.com/mszynka/battleships)

![Screenshot](https://github.com/mszynka/battleships/raw/master/screenshot.png)

## Build and run

It is a simple .NET Core app therefore all you have to do to run it locally is to run build
```bash
> dotnet build
```
and then run local web server
```bash
> dotnet run --project Battleships.Web
```

Tests are also available by standard CLI command `dotnet test`.

## Objectives

The program should create a 10x10 grid, and place several ships on the grid at random with the following sizes:

 - 1x Battleship (5 squares)
 - 2x Destroyers (4 squares).

The player enters or selects coordinates of the form “A5”, where “A” is the column and “5” is the row, to specify a square to target. Shots result in hits, misses or sinks. The game ends when all ships are sunk.

## Contributing
Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

Please make sure to update tests as appropriate.

## License
[MIT](https://choosealicense.com/licenses/mit/)
