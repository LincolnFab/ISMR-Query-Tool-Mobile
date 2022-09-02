# ISMR-Query-Tool-Mobile
Mobile app for ionospheric scintillation analysis

## Installation Tutorial

### Linux
Download and install Node.js from official repository

After install Node open the cli/terminal with ctrl + alt + T and type :
```
npm install -g ionic cordova
```

Create a base project with command:
```
ionic start ismr-query-tool blank --cordova --type=angular --no-deps
```

When creation proccess finishes clone this repository on your machine:
```
git clone https://github.com/LincolnFab/ISMR-Query-Tool-Mobile
```
Move the content in repository folder to the new project and overide them.

Finally, to install all plugins and dependencies for project, enter in project folder and run the following command:
```
npm install
```

To run an app preview use inside the folder:
```
ionic serve
```

<br/>

### Windows
Download and install Node.js executable version from official repository.

To use node commands in Windows terminal, is necessary to add the node installation path in System Environment Variables, on Windows configs.
If you installed Node with default options the folder you path will be something like:
```
C:\Program Files\nodejs\
```

After install Node and add path System Environment Variables, open the cli/terminal an type:
```
npm install -g ionic cordova
```

Create a base project with command:
```
ionic start ismr-query-tool blank --cordova --type=angular --no-deps
```

When creation proccess finishes clone this repository on your machine:
```
git clone https://github.com/LincolnFab/ISMR-Query-Tool-Mobile
```
Move the content in repository folder to the new project and overide them.

Finally, to install all plugins and dependencies for project, enter in project folder and run the following command:
```
npm install
```

To run an app preview use inside the folder:
```
ionic serve
```

<br/>

### Note
If dependency problems arise during any process, run the command in project folder:
```
npm install --f
```
