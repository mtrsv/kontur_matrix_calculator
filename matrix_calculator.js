(function(global) {
    function Matrix(options) {
        this.rowsNumber = options.rowsNumber;
        this.collsNumber = options.collsNumber;
        this.matrixElements = options.matrixElements || createElementsArray(options.rowsNumber, options.collsNumber);

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

            rotatedMatrix = new Matrix({
                rowsNumber: self.collsNumber,
                collsNumber: self.rowsNumber});

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
    // var testDiv = $("#test")[0];
    var DEFAULT_FIRST = 3,
        DEFAULT_SECOND = 2,
        DEFAULT_THIRD = 4,
        MAX_SIZE = 10,
        MIN_SIZE = 2,
        MAX_VALUE = 10;


    var resultDiv = document.querySelector(".result-matrix"),
        aDiv = document.querySelector(".first-matrix"),
        bDiv = document.querySelector(".second-matrix"),

        matrixA = new Matrix({
            rowsNumber: 3,
            collsNumber: 2,
            matrixElements:[[1, 2],
                            [3, 4],
                            [5, 6]] });
        matrixB = new Matrix({
            rowsNumber: 2,
            collsNumber: 4,
            matrixElements:[[1, 2, 3, 4],
                            [5, 6, 7, 8]] }),
        matrixC = new Matrix({
            rowsNumber: 3,
            collsNumber: 4 });

    renderAll();


    var btnMultiply = document.querySelector("#btn-multiply"),
        btnClear = document.querySelector("#btn-clear"),
        btnExchange = document.querySelector("#btn-exchange"),
        btnAddRow = document.querySelector("#btn-add-row"),
        btnDeleteRow = document.querySelector("#btn-delete-row"),
        btnAddColl = document.querySelector("#btn-add-coll"),
        btnDeleteColl = document.querySelector("#btn-delete-coll");

    btnMultiply.addEventListener("click", function () {
        updateElements();

        matrixC = calculateMatrixSumm(matrixA, matrixB);
        renderMatrix(matrixC, resultDiv, "readonly");
    })
    btnClear.addEventListener("click", function () {
        matrixA.clear();
        matrixB.clear();
        if(matrixC) matrixC.clear();
        showError("none");
        renderAll();
    });
    btnExchange.addEventListener("click", function () {
        exchangeMatrices(matrixA,matrixB);

    });
    btnAddRow.addEventListener("click", function () {
        switch ($('input[name=matrix-selection]:checked')[0].id) {
            case "first-matrix-radio":
                matrixA.addRow();
                break;
            case "second-matrix-radio":
                matrixB.addRow();
                break;
        }
    });
    btnDeleteRow.addEventListener("click", function () {
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
    btnAddColl.addEventListener("click", function () {
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
    btnDeleteColl.addEventListener("click", function () {
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

        matrixA = new Matrix({
            rowsNumber: DEFAULT_FIRST,
            collsNumber: DEFAULT_SECOND});
        matrixB = new Matrix({
            rowsNumber: DEFAULT_SECOND,
            collsNumber: DEFAULT_THIRD});
        matrixC = new Matrix({
            rowsNumber: DEFAULT_FIRST,
            collsNumber: DEFAULT_THIRD});
    }

    function renderAll() {
        renderMatrix(matrixA, aDiv);
        renderMatrix(matrixB, bDiv);
        renderMatrix(matrixC, resultDiv, "readonly");
        //setLabelBWidth();
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
        errorDiv.textContent = errorText;

    }

    function setLeftBarColor(color) {
        if (color == null || color == "none") {
            color = '';
        }
        var asideDiv = $(".left-bar")[0];
        asideDiv.style.backgroundColor = color;
    }

    function insertProperty(string, propName, propValue) {
        var propToReplace = "{{" + propName + "}}";
        string = string.replace(new RegExp(propToReplace, "g"), propValue);
        return string
    };



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


        return new Matrix({rowsNumber: matrixA.rowsNumber,
                            collsNumber: matrixB.collsNumber,
                            matrixElements:resultMatrix});
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
        generatedHtml = generatedHtml.concat("<div class='matrix-bracket-left'></div>");
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
        generatedHtml = generatedHtml.concat('<div class="matrix-bracket-right"></div>');
        generatedHtml = generatedHtml.concat('</div>');

        targetElement.innerHTML = generatedHtml;


        /*var bracketsHeight = ($("." + matrixName)[0].clientHeight);
        var brackets = $("." + matrixName + " .matrix-bracket");
        var leftBracket = brackets[0];
        var rightBracket = brackets[1];

        leftBracket.style.height = bracketsHeight + "px";
        rightBracket.style.height = bracketsHeight + "px";*/

        // $(matrixName + " .matrix-bracket")[1];
        addListeners();

    }

    /*function setLabelBWidth() {
        var labelBDiv = $("#label-b")[0];
        var matrixBDiv = $(".second-matrix")[0];
        labelBDiv.style.width = matrixBDiv.clientWidth + "px";
        // console.dir(labelBDiv);
    }*/

    function exchangeMatrices(matrixA, matrixB) {
        var tempMatrix = matrixB;
        matrixB = matrixA;
        matrixA = tempMatrix;

        matrixA.rotateMatrix();
        matrixB.rotateMatrix();
        matrixC = calculateMatrixSumm(matrixA, matrixB);
        renderAll();
        showError("none");

    }
})();