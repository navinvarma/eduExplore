var mongo = require('mongodb'),
    util = require('util'),
    config = require('./config');


// Connection URI
const uri =
    "mongodb://" + config.mongo_host + ":" + config.mongo_port + "/?ssl=false";
console.log("mongodb uri: " + uri);

// Create a new MongoClient
const client = new mongo.MongoClient(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

async function run() {
    try {
        // Connect the client to the server
        await client.connect();
        const db = client.db(config.db_name);
        console.log("Connected to '" + config.db_name + "' database");

        db.collection('programs', {
            strict: true
        }, function (err, collection) {
            if (err) {
                console.log("The 'programs' collection doesn't exist. Start with new data..");
                db.createCollection("programs");
                console.log("Created 'programs' collection..");
            }
        });
        db.collection('universities', {
            strict: true
        }, function (err, collection) {
            if (err) {
                console.log("The 'universities' collection doesn't exist. Start with new data..");
                db.createCollection("universities");
                console.log("Created 'universities' collection..");
            }
        });

        db.collection('users', {
            strict: true
        }, function (err, collection) {
            if (err) {
                console.log("The 'users' collection doesn't exist. Start with new data..");
                db.createCollection("users");
                console.log("Created 'users' collection..");
            }
        });

    } finally {
        await client.close();
    }

}

exports.findProgramById = function (req, res) {
    client.connect();
    const db = client.db(config.db_name);

    var id = req.query.id;
    if (typeof id != 'undefined') {
        //console.log('Retrieving program: ' +id);
        db.collection('programs', function (err, collection) {
            if (err) {
                throw err;
            } else {
                collection.findOne({
                    '_id': new mongo.ObjectId(id)
                }, function (err, item) {
                    if (err) {
                        throw err;
                    } else {
                        res.send(item);
                    }
                });
            }
        });
    }

};

exports.findProgramsByUniversityId = function (req, res) {
    client.connect();
    const db = client.db(config.db_name);

    var univId = req.query.univId;
    if (typeof univId != 'undefined') {
        //console.log('Retrieving programs for university: ' +univId);
        db.collection('programs', function (err, collection) {
            if (err) {
                throw err;
            } else {
                collection.find({
                    'universityId': univId
                }).toArray(function (err, items) {
                    if (err) {
                        throw err;
                    } else {
                        res.send(items);
                    }
                });
            }
        });
    }

};

exports.findUniversityById = function (req, res) {
    client.connect();
    const db = client.db(config.db_name);

    var id = req.query.id;
    if (typeof id != 'undefined') {
        //console.log('Retrieving university: ' +id);
        db.collection('universities', function (err, collection) {
            if (err) {
                throw err;
            } else {
                collection.findOne({
                    '_id': new mongo.ObjectId(id)
                }, function (err, item) {
                    if (err) {
                        throw err;
                    } else {
                        res.send(item);
                    }
                });
            }
        });
    }

};

exports.findUniversityNameById = function (req, res) {
    client.connect();
    const db = client.db(config.db_name);

    var id = req.query.id;
    if (typeof id != 'undefined') {
        //console.log('Retrieving university: ' +id);
        db.collection('universities', function (err, collection) {
            if (err) {
                throw err;
            } else {
                collection.findOne({
                    '_id': new mongo.ObjectId(id)
                }, function (err, item) {
                    if (err) {
                        throw err;
                    } else {
                        res.send(item.name);
                    }
                });
            }
        });
    }

};

exports.searchPrograms = function (req, res) {
    client.connect();
    const db = client.db(config.db_name);

    var search = req.body;
    if (typeof search != 'undefined') {
        var filters = {};
        var totaltuition = 0;
        if (typeof search.isBusinessSchool != 'undefined' && search.isBusinessSchool) {
            filters.isBusinessSchool = {
                $eq: search.isBusinessSchool
            };
            //console.log("isBusinessSchool: Filters is now "+JSON.stringify(filters));
        }

        if (typeof search.programLength != 'undefined' && search.programLength.length > 0) {
            if (search.programLength == '1') {
                filters.lengthInMonths = {
                    $lte: 12
                };
            }
            if (search.programLength == '1.5') {
                filters.lengthInMonths = {
                    $gt: 12,
                    $lt: 24
                };
            }
            if (search.programLength == '2') {
                filters.lengthInMonths = {
                    $gte: 24
                };
            }
            //console.log("programLength: Filters is now "+JSON.stringify(filters));
        }

        if (search.acceptedExam == 'GRE') {
            filters.greAccepted = true;
            if (typeof search.score != 'undefined' && search.score > 0) {
                filters.minGMATScore = {
                    $gt: parseInt(search.score)
                };
            }
            //console.log("greAccepted: Filters is now "+JSON.stringify(filters));
        }
        if (search.acceptedExam == 'GMAT') {
            filters.gmatAccepted = true;
            if (typeof search.score != 'undefined' && search.score > 0) {
                filters.minGMATScore = {
                    $gt: parseInt(search.score)
                };
            }
            //console.log("gmatAccepted: Filters is now "+JSON.stringify(filters));
        }

        if (typeof search.gpa != 'undefined') {
            var gpa = parseFloat(search.gpa);
            //console.log(gpa);
            if (gpa > 0) {
                filters.details = {
                    $elemMatch: {
                        minGPA: {
                            $gte: gpa
                        }
                    }
                };
            }
            //console.log("gpa: Filters is now "+JSON.stringify(filters));
        }

        if (typeof search.toeflScore != 'undefined' && search.toeflScore > 0) {
            filters.details = {
                $elemMatch: {
                    minTOEFLScore: {
                        $gt: parseInt(search.toeflScore)
                    }
                }
            };
            //console.log("toeflScore: Filters is now "+JSON.stringify(filters));
        }

        if (typeof search.workEx != 'undefined' && search.workEx > 0) {
            filters.details = {
                $elemMatch: {
                    minWorkEx: {
                        $gt: parseInt(search.workEx)
                    }
                }
            };
            //console.log("workEx: Filters is now "+JSON.stringify(filters));
        }
        if (typeof search.tuition != 'undefined') {
            totaltuition = parseInt(search.tuition);
            //console.log("totaltuition is "+totaltuition);
        }

        //console.log('Search tuition is '+search.tuition);
        //console.log('Filters are '+util.inspect(filters,null,false));
        db.collection('programs', function (err, collection) {
            if (err) {
                throw err;
            } else {
                var aggFilter = [{
                    $match: filters
                }, {
                    $unwind: "$details"
                }, {
                    '$project': {
                        "universityId": '$universityId',
                        "descriptionURL": '$descriptionURL',
                        "curriculumURL": '$curriculumURL',
                        "admissionRequirementsURL": '$admissionRequirementsURL',
                        "applicationURL": '$applicationURL',
                        "i20StudentURL": '$i20StudentURL',
                        "collegeName": '$collegeName',
                        "isBusinessSchool": '$isBusinessSchool',
                        "degreeTitle": '$degreeTitle',
                        "lengthInMonths": '$lengthInMonths',
                        "greAccepted": '$greAccepted',
                        "gmatAccepted": '$gmatAccepted',
                        "toeflNeeded": '$toeflNeeded',
                        "courseEvalReq": '$courseEvalReq',
                        "year": '$details.year',
                        "semester": '$details.semester',
                        "minGREScore": '$details.minGREScore',
                        "minGMATScore": '$details.minGMATScore',
                        "minTOEFLScore": '$details.minTOEFLScore',
                        "minGPA": '$details.minGPA',
                        "minWorkEx": '$details.minWorkEx',
                        "providesAid": '$details.providesAid',
                        "totaltuition": {
                            '$multiply': [
                                "$details.tuitionFee",
                                "$details.minTerms"
                            ]
                        }
                    }
                }, {
                    $match: {
                        "totaltuition": {
                            $gte: totaltuition
                        }
                    }
                }];
                //console.log(aggFilter);
                collection.aggregate(aggFilter).toArray(function (err, result) {
                    if (typeof result != 'undefined') {
                        var univIds = new Array();
                        var univNames = {};
                        for (var i = 0; i < result.length; i++) {
                            univIds.push(result[i].universityId);
                        }
                        univIds = univIds.map(function (id) {
                            return mongo.ObjectId(id);
                        });
                        db.collection('universities', function (err, collection) {
                            //console.log("univIds : "+univIds);
                            collection.find({
                                _id: {
                                    $in: univIds
                                }
                            }).toArray(function (err, collection) {
                                if (err) {
                                    throw err;
                                } else {
                                    for (var i = 0; i < collection.length; i++) {
                                        univNames[collection[i]._id] = collection[i].name;
                                    }
                                    for (var i = 0; i < result.length; i++) {
                                        //console.log("universityName : "+univNames[result[i].universityId]);
                                        result[i].universityName = {};
                                        result[i].universityName = univNames[result[i].universityId];
                                    }
                                    //console.log(JSON.stringify(result));
                                    res.send(JSON.stringify(result));
                                }
                            });
                        });
                    }
                });
            }
        });
    }
};

exports.listUniversities = function (req, res) {
    client.connect();
    const db = client.db(config.db_name);

    var page = req.query.page;
    if (page == undefined) {
        page = 1
    };
    var pageSize = req.query.pageSize;
    if (pageSize == undefined) {
        pageSize = 10
    };
    var limit = parseInt(pageSize);
    var offset = 0;
    if (page > 1) {
        offset = parseInt((page - 1) * limit);
    }

    db.collection('universities', function (err, collection) {
        collection.find().sort({
            name: 1
        }).skip(offset).limit(limit).toArray(function (err, items) {
            res.send(items);
        });
    });


};

exports.listUniversitiesTypeahead = function (req, res) {
    client.connect();
    const db = client.db(config.db_name);

    db.collection('universities', function (err, collection) {
        collection.find({}, {
            name: 1
        }).sort({
            name: 1
        }).toArray(function (err, items) {
            res.send(items);
        });
    });

};

exports.listPrograms = function (req, res) {
    client.connect();
    const db = client.db(config.db_name);

    db.collection('programs', function (err, collection) {
        collection.find().toArray(function (err, items) {
            res.send(items);
        });
    });

};

exports.saveUniversity = function (req, res) {
    client.connect();
    const db = client.db(config.db_name);

    var university = req.body;
    university._id = new mongo.ObjectId(university._id);

    //console.log('Upserting '+university._id);
    db.collection('universities', function (err, collection) {
        collection.update({
            '_id': university._id
        },
            university, {
            upsert: true
        },
            function (err, result, upserted) {
                if (err) {
                    throw err;
                } else {
                    res.send(university._id);
                }

            });

    });

};

exports.saveProgram = function (req, res) {
    client.connect();
    const db = client.db(config.db_name);

    var program = req.body;
    program._id = new mongo.ObjectId(program._id);
    program.lengthInMonths = parseInt(program.lengthInMonths) || 0;
    var programdetailsList = JSON.parse(program.details);
    if (programdetailsList.length == 0) {
        var programdetails = {};
        programdetails.index = 0;
        programdetails.year = new Date().getFullYear();
        programdetails.tuitionFee = 0;
        programdetails.minTerms = 0;
        programdetails.totalTuitionFee = 0;
        programdetails.applicationFee = 0;
        programdetails.costOfLiving = 0;
        programdetails.minGPA = 0;
        programdetails.minWorkEx = 0;
        programdetails.minGMATScore = 0;
        programdetails.minGREScore = 0;
        programdetails.minTOEFLScore = 0;
        programdetails.avgGPA = 0;
        programdetails.avgWorkEx = 0;
        programdetails.avgGMATScore = 0;
        programdetails.avgGREScore = 0;
        programdetails.avgTOEFLScore = 0;
        programdetailsList[0] = programdetails;
    } else {
        for (var i = 0; i < programdetailsList.length; i++) {
            var programdetails = programdetailsList[i];
            programdetails.year = parseInt(programdetails.year) || 0;
            programdetails.tuitionFee = parseFloat(programdetails.tuitionFee) || 0;
            programdetails.minTerms = parseInt(programdetails.minTerms) || 0;
            if (programdetails.minTerms > 0 && programdetails.tuitionFee > 0) {
                programdetails.totalTuitionFee = programdetails.tuitionFee * programdetails.minTerms;
            } else {
                programdetails.totalTuitionFee = 0;
            }
            programdetails.applicationFee = parseFloat(programdetails.applicationFee) || 0;
            programdetails.costOfLiving = parseInt(programdetails.costOfLiving) || 0;
            programdetails.minGPA = parseFloat(programdetails.minGPA) || 0;
            programdetails.minWorkEx = parseFloat(programdetails.minWorkEx) || 0;
            programdetails.minGMATScore = parseInt(programdetails.minGMATScore) || 0;
            programdetails.minGREScore = parseInt(programdetails.minGREScore) || 0;
            programdetails.minTOEFLScore = parseInt(programdetails.minTOEFLScore) || 0;
            programdetails.avgGPA = parseFloat(programdetails.avgGPA) || 0;
            programdetails.avgWorkEx = parseFloat(programdetails.avgWorkEx) || 0;
            programdetails.avgGMATScore = parseInt(programdetails.avgGMATScore) || 0;
            programdetails.avgGREScore = parseInt(programdetails.avgGREScore) || 0;
            programdetails.avgTOEFLScore = parseInt(programdetails.avgTOEFLScore) || 0;
            programdetailsList[i] = programdetails;
        }
    }
    program.details = programdetailsList;
    //console.log('Upserting '+program._id);
    db.collection('programs', function (err, collection) {
        collection.update({
            '_id': program._id
        },
            program, {
            upsert: true
        },
            function (err, result, upserted) {
                if (err) {
                    throw err;
                } else {
                    res.send(program._id);
                }

            });

    });

};
exports.deleteProgram = function (req, res) {
    client.connect();
    const db = client.db(config.db_name);

    var id = req.params.id;
    if (typeof id != 'undefined') {
        //console.log('Deleting program: ' +id);
        db.collection('programs', function (err, collection) {
            if (err) {
                throw err;
            } else {
                collection.remove({
                    '_id': new mongo.ObjectId(id)
                });
                res.status(200).send("OK");
            }
        });
    }

};
exports.deleteUniversity = function (req, res) {
    client.connect();
    const db = client.db(config.db_name);

    var id = req.params.id;
    if (typeof id != 'undefined') {
        //console.log('Deleting university: ' +id);
        db.collection('universities', function (err, collection) {
            if (err) {
                throw err;
            } else {
                collection.remove({
                    '_id': new mongo.ObjectId(id)
                });
                res.status(200).send("OK");
            }
        });
    }

};