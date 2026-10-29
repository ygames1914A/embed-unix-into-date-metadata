# embed-unix-into-date-metadata
Converts unixtimestamps into created date metadata in photos

## Why UnixToDate?
Some photos have their real captured date Unix timestamps in their name but the metadata for created date not exist

## Why is that useful?
when you organize your photos for something like immich you will see that their date is the date when you received the photos not when they were captured that will solve this issue

<img width="2072" height="1071" alt="image(2)(1)" src="https://github.com/user-attachments/assets/b8fd62d6-ea72-4d6f-a4c9-7ac68625bc6a" />

## Usage

### Linux

Run the Linux executable with the path to your photos directory:

```bash
chmod +x unixtodate-linux
./unixtodate-linux /path/to/photos
```

### Windows

Open Command Prompt or PowerShell and run:

```powershell
.\unixtodate-windows.exe "C:\path\to\photos"
```

Replace the example directory with the actual path to your photos.

## Supported Timestamps

UnixToDate supports two common Unix timestamp formats:

| Digits | Unit | Example |
|---|---|---|
| 10 digits | Seconds | `1735689600` |
| 13 digits | Milliseconds | `1735689600000` |


## Contributing

Contributions, bug reports, and suggestions are welcome. Feel free to open an issue or submit a pull request.
