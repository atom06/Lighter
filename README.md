# Smallize

Smallize is a command-line tool that allows you to split large files into smaller ones.  
I made this cause i was bored so its not that good.

## Usage

To use Smallize, run the program using the command: 
```
$ npx smallize 
```

You will then be prompted to enter the name of the file you want to split, and the segment size (in megabytes) that you want to split the file into.


If you know the name of the file and the segment size ahead of time, you can also specify them as command-line arguments when running the program:
```
$ npx smallize fiilename segmentSize
```

## Example
Aim: Segement a text file `foo.txt` of lenght 10mb into 2mb files

Non interactively:
```
$ npx smallize foo.txt 2
```

or interactively:
```
$ smallize
Enter a file to split (or type "exit" to stop): foo.txt
Enter segment size for file largefile.zip (in MB): 2
```

And thats it!

## License

Carbon license

## Made By

- [Carbon](@atom06): Made smallize
- [Micheal Barati](@INeddHelp): Made Lighter

*Smallized was forked from lighter and then made intro this*