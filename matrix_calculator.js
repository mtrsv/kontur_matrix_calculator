(function(global) {

    // var testDiv = $("#test")[0];
    var DEFAULT_FIRST = 3;
    var DEFAULT_SECOND = 2;
    var DEFAULT_THIRD = 4;
    var MAX_SIZE = 10;
    var MIN_SIZE = 2;
    var MAX_VALUE = 10;


    var resultDiv = $(".result-matrix")[0];
    var aDiv = $(".first-matrix")[0];
    var bDiv = $(".second-matrix")[0];
    var matrixA = new Matrix(3, 2, [[1, 2],
        [3, 4],
        [5, 6]]);

    var matrixB = new Matrix(2, 4, [[1, 2, 3, 4],
        [5, 6, 7, 8]]);

    var matrixC = new Matrix(3, 4);

    renderAll();


    var btnMultiply = $("#btn-multiply")[0];
    var btnClear = $("#btn-clear")[0];
    var btnExchange = $("#btn-exchange")[0];
    var btnAddRow = $("#btn-add-row")[0];
    var btnDeleteRow = $("#btn-delete-row")[0];
    var btnAddColl = $("#btn-add-coll")[0];
    var btnDeleteColl = $("#btn-delete-coll")[0];

    btnMultiply.onclick = (function () {
        updateElements();

        matrixC = calculateMatrixSumm(matrixA, matrixB);
        renderMatrix(matrixC, resultDiv, "readonly");
    });
    btnClear.onclick = (function () {
        matrixA.clear();
        matrixB.clear();
        matrixC.clear();
        showError("none");
        renderAll();
    });
    btnExchange.onclick = (function () {
        // exchangeMatrices(matrixA,matrixB);
        var tempMatrix = matrixB;
        matrixB = matrixA;
        matrixA = tempMatrix;

        matrixA.rotateMatrix();
        matrixB.rotateMatrix();
        matrixC = calculateMatrixSumm(matrixA, matrixB);
        renderAll();
        showError("none");
    });
    btnAddRow.onclick = (function () {
        switch ($('input[name=matrix-selection]:checked')[0].id) {
            case "first-matrix-radio":
                matrixA.addRow();
                break;
            case "second-matrix-radio":
                matrixB.addRow();
                break;
        }
    });
    btnDeleteRow.onclick = (function () {
        switch ($('input[name=matrix-selection]:checked')[0].id) {
            case "first-matrix-radio":
                matrixA.deleteRow();
                break;
            case "second-matrix-radio":
                matrixB.deleteRow();
                break;
        }
        showError("none");

    });
    btnAddColl.onclick = (function () {
        switch ($('input[name=matrix-selection]:checked')[0].id) {
            case "first-matrix-radio":
                matrixA.addColl();
                break;
            case "second-matrix-radio":
                matrixB.addColl();
                break;
        }
        showError("none");

    });
    btnDeleteColl.onclick = (function () {
        switch ($('input[name=matrix-selection]:checked')[0].id) {
            case "first-matrix-radio":
                matrixA.deleteColl();
                break;
            case "second-matrix-radio":
                matrixB.deleteColl();
                break;
        }
        showError("none");

    });

    function updateElements() {
        matrixA.updateElements(".first-matrix");
        matrixB.updateElements(".second-matrix");
    }

    function setAllDefault() {
        matrixA = new Matrix(DEFAULT_FIRST, DEFAULT_SECOND);
        matrixB = new Matrix(DEFAULT_SECOND, DEFAULT_THIRD);
        matrixC = new Matrix(DEFAULT_FIRST, DEFAULT_THIRD);
    }

    function renderAll() {
        renderMatrix(matrixA, aDiv);
        renderMatrix(matrixB, bDiv);
        renderMatrix(matrixC, resultDiv, "readonly");
        setLabelBWidth();
        // console.log("render all");
    }

    function addListeners() {
        var cellArray = $(".matrix-cell");
        for (var i = 0; i < cellArray.length; i++) {
            cellArray[i].onclick = function (e) {
                this.select();
                setLeftBarColor("#5199DB");
            };
            cellArray[i].onblur = function (e) {
                setLeftBarColor("none");

                e.target.classList.remove("sell-default");
                if (isNaN(e.target.value)) {
                    e.target.value = 0;
                }
                if (e.target.value > MAX_VALUE) {
                    e.target.value = MAX_VALUE;
                }
                if (e.target.value < -MAX_VALUE) {
                    e.target.value = -MAX_VALUE;
                }

            };
        }
    }

    function removeListeners() {
        var cellArray = $(".matrix-cell");
        for (var i = 0; i < cellArray.length; i++) {
            cellArray[i].onclick = null;
            cellArray[i].onblur = null;
        }
    }

    function showError(errorName) {
        var errorText = '';
        switch (errorName) {
            case "not_commutative":
                errorText = "Такие матрицы нельзя умножить, так как количесво столбцов матрицы А " +
                    "не равно количеству строк матрицы В.";
                setLeftBarColor("#F6C1C0");
                break;
            case "none":
                errorText = "";
                setLeftBarColor("none");
                break;
        }
        var errorDiv = $("#error-text")[0];
        errorDiv.innerText = errorText;

    }

    function setLeftBarColor(color) {
        if (color == null || color == "none") {
            color = '';
        }
        var asideDiv = $(".left-bar")[0];
        asideDiv.style.backgroundColor = color;
    }

    var insertProperty = function (string, propName, propValue) {
        var propToReplace = "{{" + propName + "}}";
        string = string.replace(new RegExp(propToReplace, "g"), propValue);
        return string
    };

    function Matrix(rowsNumber, collsNumber, matrixElements) {
        this.rowsNumber = rowsNumber;
        this.collsNumber = collsNumber;
        this.matrixElements = matrixElements || createElementsArray(rowsNumber, collsNumber);

        var self = this;

        function createElementsArray(rows, colls, elementValue) {
            var elements = [];
            for (var i = 0; i < rows; i++) {
                var newRow = [];
                elements[i] = newRow;
                for (var k = 0; k < colls; k++) {
                    // newRow[k] = 1;
                    newRow[k] = elementValue;
                }
            }
            // console.log("Array:");
            // console.log(elements);
            return elements;
        }

        this.updateElements = function (source) {
            /* source = id of the matrix */
            for (var i = 0; i < self.rowsNumber; i++) {
                self.matrixElements[i] = [];
            }

            /*console.log(source);
             console.log(collsNumber);*/

            var matrixCells = $(source + " .matrix-cell");
            // console.log(matrixCells);
            for (i = 0; i < matrixCells.length; i++) {
                var positionInRow = i % self.collsNumber;
                var rowNumber = Math.floor(i / self.collsNumber);

                self.matrixElements[rowNumber][positionInRow] = matrixCells[i].value;
                // console.log(matrixCells[i].value);
                // console.log(rowNumber,positionInRow,matrixCells[i].value);
            }
            return self;
        };

        this.rotateMatrix = function () {
            var rotatedMatrix;

            rotatedMatrix = new Matrix(self.collsNumber, self.rowsNumber);
            var rotatedElements = [];
            for (var i = 0; i < self.collsNumber; i++) {
                rotatedElements[i] = [];
            }
            for (i = 0; i < self.matrixElements.length; i++) {
                var rowElements = self.matrixElements[i];
                for (var j = 0; j < rowElements.length; j++) {
                    rotatedElements[j][i] = self.matrixElements[i][j];
                }
            }
            rotatedMatrix.matrixElements = rotatedElements;

            self.collsNumber = rotatedMatrix.collsNumber;
            self.rowsNumber = rotatedMatrix.rowsNumber;
            self.matrixElements = rotatedMatrix.matrixElements;
        };

        this.addRow = function () {
            if (self.rowsNumber == MAX_SIZE) return;
            self.rowsNumber++;

            var newRow = [];

            for (var i = 0; i < self.collsNumber; i++) {
                newRow[i] = null;
            }

            self.matrixElements[self.matrixElements.length] = newRow;
            // console.dir(matrixElements);
            renderAll();
        };

        this.deleteRow = function () {
            if (self.rowsNumber <= MIN_SIZE) return;
            self.rowsNumber--;
            self.matrixElements.pop();
            renderAll();
        };

        this.addColl = function () {
            if (self.collsNumber == MAX_SIZE) return;
            self.collsNumber++;

            for (var i = 0; i < self.rowsNumber; i++) {
                self.matrixElements[i].push(null);
            }
            renderAll();
        };

        this.deleteColl = function () {
            if (self.collsNumber <= MIN_SIZE) return;
            self.collsNumber--;

            for (var i = 0; i < self.rowsNumber; i++) {
                self.matrixElements[i].pop();
            }
            //console.dir(self.collsNumber);
            renderAll();
        };

        this.clear = function () {
            // this.matrixElements = createElementsArray(rowsNumber,collsNumber,"");
            self.matrixElements = createElementsArray(self.rowsNumber, self.collsNumber);
        };


    }


    /*function MatrixArr(rowsNumber, collsNumber, matrixElements) {
     Matrix.prototype = Object.create([].prototype);
     this.rowsNumber = rowsNumber;
     this.collsNumber = collsNumber;
     this.matrixElements = matrixElements || createElementsArray(rowsNumber,collsNumber);

     function createElementsArray(rows,colls){
     var elements = [];
     for (var i=0; i < rowsNumber; i++) {
     var newRow = [];
     elements[i] =  newRow;
     for (var k=0; k < collsNumber; k++) {
     // newRow[k] = 1;
     newRow[k] = null;
     }
     }
     console.log("Array:");
     console.log(elements);
     return elements;
     }
     }*/

    function calculateMatrixSumm(matrixA, matrixB) {
        var resultMatrix = [];
        var iNumber;
        // debugger;
        if (matrixA.collsNumber == matrixB.rowsNumber) {
            iNumber = matrixA.collsNumber;
            resultMatrix = createElementsArray(matrixA.rowsNumber, matrixB.collsNumber);
        } else return null;

        function createElementsArray(rows, colls) {
            // console.log("Rows: " + rows + ", colls: " + colls);
            var elements = [];
            for (var i = 0; i < rows; i++) {
                var newRow = [];
                elements[i] = newRow;
                for (var j = 0; j < colls; j++) {
                    // newRow[k] = matrixA.matrixElements[k][i]*matrixB.matrixElements[i][k];
                    newRow[j] = calculateElement(i, j);
                    // console.log(i,j,newRow[j]);
                }
            }
            /*console.log("Array:");
             console.log(elements);*/
            return elements;
        }

        function calculateElement(i, j) {
            var result = 0;
            for (var k = 0; k < iNumber; k++) {
                result += matrixA.matrixElements[i][k] * matrixB.matrixElements[k][j];
                // console.log(result + "=" + matrixA.matrixElements[i][k] + "*"+ matrixB.matrixElements[k][j]);
                // debugger;
            }
            return result;
        }

        return new Matrix(matrixA.rowsNumber, matrixB.collsNumber, resultMatrix);
    }

    function renderMatrix(matrix, targetElement, readonly) {
        /*generate matrix in target element*/
        // console.dir(targetElement.className);
        removeListeners();


        if (!matrix) {
            //targetElement.innerHTML = "matrix = null";
            showError("not_commutative");
            return;
        }
        setLeftBarColor();
        showError("none");
        var matrixName = targetElement.className;
        var rowsNumber = matrix.rowsNumber;
        var collsNumber = matrix.collsNumber;

        var generatedHtml = "";
        generatedHtml = generatedHtml.concat("<div class='matrix-border left'></div>");
        generatedHtml = generatedHtml.concat("<div class='matrix'>");

        for (var i = 0; i < rowsNumber; i++) {
            generatedHtml = generatedHtml.concat("<div class='matrix-row'>");
            for (var k = 0; k < collsNumber; k++) {
                generatedHtml = generatedHtml.concat('<input type="text"');
                if (readonly) {
                    generatedHtml = generatedHtml.concat(' readonly ');
                }

                generatedHtml = generatedHtml.concat(' class="matrix-cell ');
                if (matrix.matrixElements[i][k] == null || isNaN(matrix.matrixElements[i][k])) {
                    generatedHtml = generatedHtml.concat(' sell-default ');
                    generatedHtml = generatedHtml.concat(' " ');
                    generatedHtml = generatedHtml.concat('value="c' + (i + 1) + ',' + (k + 1) + '">');
                } else {

                    generatedHtml = generatedHtml.concat(' " ');
                    generatedHtml = generatedHtml.concat('value="' + matrix.matrixElements[i][k] + '">');
                }
            }
            generatedHtml = generatedHtml.concat('</div>');
        }


        generatedHtml = generatedHtml.concat('</div>');
        generatedHtml = generatedHtml.concat('<div class="matrix-border right"></div>');
        generatedHtml = generatedHtml.concat('</div>');

        targetElement.innerHTML = generatedHtml;


        var bracketsHeight = ($("." + matrixName)[0].clientHeight);
        var brackets = $("." + matrixName + " .matrix-border");
        var leftBracket = brackets[0];
        var rightBracket = brackets[1];

        leftBracket.style.height = bracketsHeight + "px";
        rightBracket.style.height = bracketsHeight + "px";
        // $(matrixName + " .matrix-border")[1];
        addListeners();

    }

    function setLabelBWidth() {
        var labelBDiv = $("#label-b")[0];
        var matrixBDiv = $(".second-matrix")[0];
        labelBDiv.style.width = matrixBDiv.clientWidth + "px";
        // console.dir(labelBDiv);
    }

    function exchangeMatrices(matrixA, matrixB) {
        var tempMatrix = matrixB;
        matrixB = matrixA;
        matrixA = tempMatrix;

        matrixA.rotateMatrix();
        matrixB.rotateMatrix();

    }
})();