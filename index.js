#!/usr/bin/env node

require('module-alias/register');
const {Command} = require('commander');
const getOutsideContributors = require('~/bin/get-outside-conrtibutors');
const getPullRequests = require('~/bin/get-pull-requests');
const getIssues = require('~/bin/get-issues');
const getReposWithout = require('~/bin/get-repos-without');
const getReposWithoutCommits = require('~/bin/get-repos-without-commits');

const CLI = new Command();
getOutsideContributors(CLI);
getPullRequests(CLI);
getIssues(CLI);
getReposWithout(CLI);
getReposWithoutCommits(CLI);
CLI.parse(process.argv);
