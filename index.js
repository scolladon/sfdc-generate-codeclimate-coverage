'use strict';
const createHash = require('crypto').createHash;
const fs = require('fs');
const spawnSync = require('child_process').spawnSync;

module.exports = (config,deployResult,logger) => {
  return new Promise((resolve, reject) => {
    if(!deployResult.success || !deployResult.runTestsEnabled) {
      reject(new Error('coverage not readable'));
    }
    if(typeof config.repotoken === 'undefined' || config.repotoken === null
    || typeof config.commit === 'undefined' || config.commit === null
    || typeof config.branch === 'undefined' || config.branch === null
    || typeof config.repo === 'undefined' || config.repo === null) {
      return reject(new Error('Not enough config options'));
    }

    let totalLine = 0;
    let totalLineUncovered = 0;

    let committed_at = new Buffer(
      spawnSync('git', ['log','-1', '--pretty=format:%ct', 'HEAD'],{
        "cwd": config.repo
      }).stdout
    ).toString('utf8').trim();
    console.log(committed_at)

    let coverage = {
      'repo_token':config.repotoken,
      'run_at':(new Date(deployResult.completedDate)).getTime(),
      'partial': false,
      'git': {
        'head': config.commit,
        'committed_at': committed_at,
        'branch': config.branch
      }
    };

    let dir_content = fs.readdirSync(config.repo+'/src/classes');
    coverage.source_files = deployResult.details.runTestResult.codeCoverage.filter(raw =>{
      return raw.type == 'Class';
    }).map(element => {
      // TODO handle trigger
      let buffer = dir_content.indexOf(element.name+'.cls') !== -1 ? fs.readFileSync(config.repo+'/src/classes/'+element.name+'.cls') : 'empty';
      
      totalLine += parseInt(element.numLocations);
      totalLineUncovered += parseInt(element.numLocationsNotCovered);

      let uncoveredIndex = [];
      if(element.locationsNotCovered instanceof Array){
        uncoveredIndex = element.locationsNotCovered.map(loc =>{
          return ''+loc.line;
        });
      } else if(element.locationsNotCovered instanceof Object){
        uncoveredIndex.push(''+element.locationsNotCovered.line);
      }

      let coverageArray = [];
      for(let i = 1 ; i <= element.numLocations ; ++i) {
        coverageArray.push( uncoveredIndex.indexOf(''+i) !== -1 ? 0 : 1 );
      }

      return {
        'name': 'classes/'+element.name+'.cls',
        'blob_id': createHash('sha1').update(buffer).digest('hex'),
        'coverage': coverageArray,
        'covered_percent': +((element.numLocations - element.numLocationsNotCovered) / element.numLocations * 100).toFixed(2),
        'covered_strength': +((element.numLocations - element.numLocationsNotCovered) / element.numLocations).toFixed(1),
        'line_counts': {
          'total': element.numLocations,
          'covered': element.numLocations - element.numLocationsNotCovered,
          'missed': element.numLocationsNotCovered
        }
      };
    });

    coverage.covered_percent = +((totalLine - totalLineUncovered) / totalLine * 100).toFixed(2);
    coverage.covered_strength = +((totalLine - totalLineUncovered) / totalLine).toFixed(1);
    coverage.line_counts = {
      'total': totalLine,
      'covered': totalLine-totalLineUncovered,
      'missed': totalLineUncovered
    }
    logger('Coverage transformed');
    resolve(coverage);
  });
};