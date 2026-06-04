const fs = require('fs');
const { Command } = require('commander');
const program = new Command();

program
  .name('counter')
  .description('CLI to do file based tasks')
  .version('0.8.0');

program.command('count')
  .description('Count the number of lines in a file')
  .argument('<file>', 'file to count')
  .action((file) => {
    fs.readFile(file, 'utf8', (err, data) => {
      if (err) {
        console.log(err);
      } else {
        const lines = data.split(' ').length;
        console.log(`There are ${lines} words in ${file}`);
      }
    });
  });

program.command('create')
  .description('Create a file with the given name')
  .argument('<file>', 'file to create')
  .action((file) => {
    fs.writeFile(file, 'kya hal hai', (err) => {
      if (err) {
        console.log(err);
      } else {
        console.log(`File created: ${file}`);
      }
    });
  });

program.parse();