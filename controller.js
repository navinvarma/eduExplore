var eduExploreApp = angular.module('eduExploreApp', ['ngRoute', 'ui.bootstrap']);

function getUrlParameter(param, dummyPath) {
    var sPageURL = dummyPath || window.location.search.substring(1),
        sURLVariables = sPageURL.split(/[&||?]/),
        res;

    for (var i = 0; i < sURLVariables.length; i += 1) {
        var paramName = sURLVariables[i],
            sParameterName = (paramName || '').split('=');

        if (sParameterName[0] === param) {
            res = sParameterName[1];
        }
    }

    return res;
}
eduExploreApp.controller('eduExploreController', function ($scope, $http) {
    $scope.pageSize = 100;
    $scope.currentPage = 1;

    $scope.nextPage = function () {
        $scope.currentPage++;
        setPage($scope.currentPage)
    }

    $scope.prevPage = function () {
        $scope.currentPage--;
        setPage($scope.currentPage)
    }

    function setPage(page) {
        if (page <= 0) {
            page = 1;
        }
        $http.get('listUniversities?pageSize=' + $scope.pageSize + '&page=' + page).success(function (data) {
            $scope.universities = data;
        });

    }

    $scope.listPrograms = function () {
        $http.get('listPrograms').success(function (data) {
            $scope.programs = data;
        });
    }
    $scope.listUniversities = function () {
        $http.get('listUniversities').success(function (data) {
            $scope.universities = data;
        });

    }
    $scope.listUniversitiesTypeahead = function () {
        $http.get('listUniversitiesTypeahead').success(function (data) {
            $scope.universitiesTypeahead = data;
        });

    }

    $scope.saveProgram = function () {
        var univId = getUrlParameter('univId');
        $scope.program.details = {};
        $scope.program.details = angular.toJson($scope.programdetailsList);
        var data = $scope.program;
        if (typeof data != 'undefined') {
            $http.post('/saveProgram', data).success(function () {
                window.location.replace("/university?id=" + univId);
            });
        }
    };

    $scope.saveProgramDetails = function () {
        var programdetails_data = $scope.programdetails;
        if (typeof programdetails_data.index == 'undefined') {
            // Add new
            $scope.programdetailsList.push(programdetails_data);
        } else {
            //Edit existing
            $scope.programdetailsList[programdetails_data.index] = programdetails_data;
        }

        $("#programdetails").modal('hide');
    };
    $scope.saveUniversity = function () {
        var data = $scope.university;
        if (typeof data != 'undefined') {
            $http.post('/saveUniversity', data).success(function () {
                window.location.replace("/universities");
            });
        }
    };
    $scope.createNewUniversity = function () {
        if (typeof $scope.university != 'undefined' && $scope.university.length > 0) {
            var university = {
                name: $scope.university
            }
            $http.post('/saveUniversity', university).success(function (data) {
                window.location.replace("/university?id=" + data);
            });
        } else {
            if ($("#univWarning").length == 0)
                $("#university").after("<div id='univWarning' class='alert alert-warning'>Type the name of the university and click +University to create new university.</div>");
        }

    }
    $scope.deleteProgram = function (_id) {
        if (typeof _id != 'undefined') {
            if (confirm("Are you sure you want to delete?")) {
                $http.delete('/deleteProgram/' + _id).success(function () {
                    $scope.listPrograms();
                });
            }
        }
    };
    $scope.deleteUniversity = function (_id) {
        if (typeof _id != 'undefined') {
            if (confirm("Are you sure you want to delete?")) {
                $http.delete('/deleteUniversity/' + _id).success(function () {
                    window.location.replace("/universities");
                });
            }
        }
    };

    $scope.getProgram = function () {
        $scope.programdetailsList = new Array();
        $scope.program = {};
        var univId = getUrlParameter('univId');
        var id = getUrlParameter('id');
        var context = getUrlParameter('context');
        $http.get('/findUniversityNameById?id=' + univId).success(function (data) {
            $scope.program.universityId = univId;
            $(".universityName").append(data);
            $("#universityName").val(data);

        });
        if (id != null) {
            $http.get('/findProgramById?id=' + id).success(function (data) {
                $scope.program = data;
                if (typeof data.details != 'undefined') {
                    $scope.programdetailsList = angular.fromJson(data.details);
                }
            });
        }
        if (context != null && context == 'searchresult') {
            $scope.returnToSearch = true;
        } else {
            $scope.returnToSearch = false;
        }
    }

    $scope.getUniversity = function () {
        var id = getUrlParameter('id');
        $http.get('/findUniversityById?id=' + id).success(function (data) {
            $scope.university = data;
        });
        $http.get('/findProgramsByUniversityId?univId=' + id).success(function (data) {
            $scope.programs = data;
        });
    }

    $scope.searchPrograms = function () {
        $('.alert').remove();
        var searchParams = $scope.search;
        if (typeof searchParams == 'undefined' || searchParams == '') {
            $('#listPrograms').append('<div class="alert alert-danger" role="alert">Pssst... kuch bhi!!</div>')
        } else {
            $http.post('/searchPrograms', searchParams).success(function (data) {
                $scope.searchresults = data;
                if (data.length == 0 && $("#notFoundPrograms").length == 0) {
                    $('#listPrograms').before('<div id="notFoundPrograms" class="alert alert-danger" role="alert">No programs found...</div>')
                }
            });
        }
    }

    $scope.initSearch = function () {
        $scope.search = {};
        $scope.search = {
            tuition: 0,
            score: 0,
            toeflScore: 0,
            workEx: 0
        };
    }

    $scope.searchReset = function () {
        $scope.initSearch();
        $scope.search = angular.copy($scope.search);
        $('#foundPrograms').remove();
        $scope.searchPrograms();
    }

    $scope.isActive = function (viewLocation) {
        return viewLocation === document.location.pathname;
    };

    $scope.$watch('search', function (newValue, oldValue) {
        if (newValue !== oldValue) {
            $scope.searchPrograms();
        }
    }, true);

    $scope.increment = function (model) {
        switch (model) {
            case 'tuition':
                $scope.search.tuition = parseInt($scope.search.tuition) + 5000;
                break;
            case 'score':
                $scope.search.score = parseInt($scope.search.score) + 5;
                break;
            case 'toeflScore':
                if ($scope.search.toeflScore + 5 <= 120) {
                    $scope.search.toeflScore = parseInt($scope.search.toeflScore) + 5;
                } else {
                    $scope.search.toeflScore = 120;
                }
                break;
            case 'workEx':
                $scope.search.workEx = parseInt($scope.search.workEx) + 1;
                break;
        }

    }

    $scope.decrement = function (model) {
        switch (model) {
            case 'tuition':
                if ($scope.search.tuition - 5000 > 0) {
                    $scope.search.tuition = parseInt($scope.search.tuition) - 5000;
                } else {
                    $scope.search.tuition = 0;
                }
                break;
            case 'score':
                if ($scope.search.score - 5 > 200) {
                    $scope.search.score = parseInt($scope.search.score) - 5;
                } else {
                    $scope.search.score = 0;
                }
            case 'toeflScore':
                if ($scope.search.toeflScore - 5 > 50) {
                    $scope.search.toeflScore = parseInt($scope.search.toeflScore) - 5;
                } else {
                    $scope.search.toeflScore = 0;
                }
                break;
            case 'workEx':
                if ($scope.search.workEx - 1 > 0) {
                    $scope.search.workEx = parseInt($scope.search.workEx) - 1;
                } else {
                    $scope.search.workEx = 0;
                }
                break;
        }

    }

    $scope.fetchUniversity = function (univId) {
        window.location = "/university?id=" + univId;
    }

    $scope.fetchProgram = function (univId, programId, originIsSearch) {
        var url = "/program?univId=" + univId + "&id=" + programId;
        if (originIsSearch) {
            url += "&context=searchresult";
        }
        window.location = url;
    }

    $scope.createNewProgram = function (univId) {
        window.location = "/program?univId=" + univId;
    }

    $scope.programDetailsDialog = function () {
        $scope.programdetails = {};
        $("#programdetails").modal();

    }

    $scope.editProgramDetails = function (index) {
        $scope.programdetails = $scope.programdetailsList[index];
        $scope.programdetails.index = index;
        $("#programdetails").modal();

    }

    $scope.deleteProgramDetails = function (index) {
        if (confirm("Are you sure you want to delete?")) {
            $scope.programdetailsList.splice(index, 1);
        }
    }

    if (document.location.pathname == '/') {
        $scope.initSearch();
    }

    if (document.location.pathname == '/universities') {
        $scope.listUniversities();
        $scope.listUniversitiesTypeahead();
    }

    $(document).ready(function () {
        $(".ngselect option[value='? undefined:undefined ?']").remove();
    });

    $(".alert-success").alert();
    window.setTimeout(function () {
        $(".alert-success").alert('close');
    }, 3000);

});