'use strict';
const Generator = require('yeoman-generator');
const chalk = require('chalk');
const yosay = require('yosay');
const inquirer = require('inquirer');

module.exports = class extends Generator {
  async prompting() {
    // Greeting user
    this.log(yosay(`Welcome to the ${chalk.red('new-flask-app')} generator!`));

    // App name and type
    const base = [
      {
        type: 'input',
        name: 'appName',
        message: 'Enter your app name:',
        default: 'MyApp',
        validate: function(appName) {
          if (/^[A-Za-z_]{3,}$/.test(appName)) {
            return true;
          } else {
            return "Invalid app name! (must only contain letters and underscores, at least 3 characters long)"
          }
        }
      },
      {
        type: 'list',
        name: 'appType',
        message: 'Chose your application type:',
        choices: [
          'website-min',
          // TODO 'website',
          // TODO 'api-min',
          // TODO 'api',
          // TODO 'website-api'
        ]
      }
    ]
    this.answers = await this.prompt(base)

    const website_min = [
      {
          type: 'checkbox',
          name: 'options',
          message: 'What options would you like to include?',
          choices: [
            new inquirer.Separator("Frontend:"),
            {
              value: 'bootstrap'
            },
            {
              value: 'jquery',
              checked: true
            }
          ]
        }
    ]
    const common = [
      {
        type: 'confirm',
        name: 'git',
        message: 'Initialize git repository?',
        default: true
      },
      // TODO {
      //   type: 'confirm',
      //   name: 'venv',
      //   message: 'Initialize python virtual environnement?',
      //   default: false
      // }
    ]

    switch (this.answers.appType) {
      case 'website-min':
        var prompts = [
          ...website_min
        ]
        break;
    }
    this.answers = {
      ...this.answers,
      ...await this.prompt(prompts),
      ...await this.prompt(common),
    }

    this.log(this.answers)
  }

  writing() {
    // Common
    if (this.answers.git) {
      this.spawnCommandSync('git', ['init', '--quiet']);
      this.log(`   ${chalk.green('cmd')} git initiated`)
      this.fs.copy(
        this.templatePath('common/.gitignore'),
        this.destinationPath('.gitignore')
      )
    }
    this.fs.copyTpl(
      this.templatePath('common/run.py'),
      this.destinationPath('run.py'),
      this.answers
    )

    // Main
    switch (this.answers.appType) {
      case 'website-min':
        // this.fs.copy(
        //   this.templatePath('website-min/app/static/**'),
        //   this.destinationPath(this.answers.appName + "/static/")
        // )
        // this.fs.copyTpl(
        //   this.templatePath('website-min/app/templates/**'),
        //   this.destinationPath(this.answers.appName + "/templates/"),
        //   this.answers
        // )
        this.fs.copyTpl(
          this.templatePath('website-min/app/**'),
          this.destinationPath(this.answers.appName + "/"),
          this.answers
        )
        break;
    }
  }

  install() {
    // this.installDependencies();
  }
};
