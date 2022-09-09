#!/bin/sh
mongoexport --db edu-explore --collection universities --out universities.json
mongoexport --db edu-explore --collection programs --out programs.json