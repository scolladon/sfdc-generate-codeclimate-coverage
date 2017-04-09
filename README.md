# sfdc-generate-codeclimate-coverage

Code coverage converter to codeclimate format from deployment result

## Getting Started

Works in Unix like system.
Windows is not tested.

### Installing

```
npm install -g sfdc-generate-lcov-coverage
```

or

```
yarn globally add sfdc-generate-lcov-coverage
```

## Usage

### Command Line

```
$ sgc -h

  Usage: sgc [options]

  Code coverage converter to codeclimate format from deployment result

  Options:

    -t, --repotoken             code climate repo tok
    -c, --commit                commit sha
    -b, --branch                branch name
    -r, --repo                  salesforce repository path : ['.']
    -d, --deployfile            salesforce deploy result containing file : ['./deployResult.json']
    -o, --output                salesforce code climate coverage output file : ['./coverage_<epoch timestamp>.json']
```

### Module

```
  const sgc = require('sfdc-generate-lcov-coverage');

  let deployResult = {} // deployment result file, pipe it from deployment or read it from a file
  sgc({
    'repotoken':'azertyuioiuytrez', // code climate repo token
    'commit': 'oiuyrertyuiopoiuy', // git commit id
    'branch': 'master', // branch name on which the deploy has been done
    'repo': '.', // salesforce metadata repository
  },deployResult,console.log)
  .then(coverage => {
    console.log(coverage); // pipe it or write it to a file
  });
```


## Built With

* [commander](https://github.com/tj/commander.js/) - The complete solution for node.js command-line interfaces, inspired by Ruby's commander.

## Versioning

[SemVer](http://semver.org/) is used for versioning.

## Authors

* **Sebastien Colladon** - *Initial work* - [scolladon](https://github.com/scolladon)

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details
