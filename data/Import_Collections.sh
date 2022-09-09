#!/bin/sh
mongoimport --db edu-explore --drop --collection universities --file universities.json && mongoimport --db edu-explore --drop --collection programs --file programs.json