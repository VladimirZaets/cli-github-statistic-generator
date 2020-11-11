#!/usr/bin/env node

require('module-alias/register');
const {Command} = require('commander');
const getOutsideContributors = require('~/bin/get-outside-conrtibutors');
const getPullRequests = require('~/bin/get-pull-requests');
const getIssues = require('~/bin/get-issues');
const getReposWithout = require('~/bin/get-repos-without-files');
const getReposWithoutCommits = require('~/bin/get-repos-without-commits');
const getTransparencyLevel = require('~/bin/get-opensource-transparency-level');
const getPresenceFiles = require('~/bin/get-presence-files');
const getNewRepos = require('~/bin/get-new-repos');
const getLevelOfInterest = require('~/bin/get-level-of-interest');
const getOpenProcessedPrs = require('~/bin/get-open-processed-prs');
const getTimeToReact = require('~/bin/get-time-to-react');

const CLI = new Command();
getOutsideContributors(CLI);
getPullRequests(CLI);
getIssues(CLI);
getReposWithout(CLI);
getReposWithoutCommits(CLI);
getTransparencyLevel(CLI);
getPresenceFiles(CLI);
getNewRepos(CLI);
getLevelOfInterest(CLI);
getOpenProcessedPrs(CLI);
getTimeToReact(CLI);
CLI.parse(process.argv);
