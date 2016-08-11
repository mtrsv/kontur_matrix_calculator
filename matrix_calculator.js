(function(global) {
    function MatrixCalculator(options) {

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

                var matrixCells = $(source + " .matrix-cell");
                for (i = 0; i < matrixCells.length; i++) {
                    var positionInRow = i % self.collsNumber;
                    var rowNumber = Math.floor(i / self.collsNumber);

                    self.matrixElements[rowNumber][positionInRow] = matrixCells[i].value;
                }
                return self;
            };

            this.rotateMatrix = function () {
                var rotatedMatrix;

                rotatedMatrix = new Matrix({
                    rowsNumber: self.collsNumber,
                    collsNumber: self.rowsNumber
                });

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
                self.matrixElements.push(newRow);
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
                renderAll();
            };

            this.deleteColl = function () {
                if (self.collsNumber <= MIN_SIZE) return;
                self.collsNumber--;

                for (var i = 0; i < self.rowsNumber; i++) {
                    self.matrixElements[i].pop();
                }
                renderAll();
            };

            this.clear = function () {
                self.matrixElements = createElementsArray(self.rowsNumber, self.collsNumber);
            };


        }

        var DEFAULT_FIRST = 3,
            DEFAULT_SECOND = 2,
            DEFAULT_THIRD = 4,
            MAX_SIZE = 10,
            MIN_SIZE = 2,
            MAX_VALUE = 10;

        var calculatorElement = options.calculatorElement,
            resultDiv = calculatorElement.querySelector(".result-matrix .matrix"),
            aDiv = calculatorElement.querySelector(".first-matrix .matrix"),
            bDiv = calculatorElement.querySelector(".second-matrix .matrix"),
            controls = calculatorElement.querySelector(".left-bar"),
            matrices = calculatorElement.querySelector(".right-bar");

        var matrixA = new Matrix({
                rowsNumber: 3,
                collsNumber: 2,
                matrixElements:
                    [[1, 2],
                    [3, 4],
                    [5, 6]]
            });
            matrixB = new Matrix({
                rowsNumber: 2,
                collsNumber: 4,
                matrixElements:
                    [[1, 2, 3, 4],
                     [5, 6, 7, 8]]
            }),
            matrixC = new Matrix({
                rowsNumber: 3,
                collsNumber: 4
            });

        addListeners();
        renderAll();



        function updateElements() {
            matrixA.updateElements(".first-matrix");
            matrixB.updateElements(".second-matrix");
        }

        function setAllDefault() {

            matrixA = new Matrix({
                rowsNumber: DEFAULT_FIRST,
                collsNumber: DEFAULT_SECOND
            });
            matrixB = new Matrix({
                rowsNumber: DEFAULT_SECOND,
                collsNumber: DEFAULT_THIRD
            });
            matrixC = new Matrix({
                rowsNumber: DEFAULT_FIRST,
                collsNumber: DEFAULT_THIRD
            });
        }

        function renderAll() {
            renderMatrix(matrixA, aDiv);
            renderMatrix(matrixB, bDiv);
            renderMatrix(matrixC, resultDiv, "readonly");
            // console.log("render all");
        }


        function addListeners() {
            matrices.addEventListener("click",onMatrixClick.bind(this));
            matrices.addEventListener("blur",onMatrixBlur.bind(this),true);
            controls.addEventListener("click",onControlsClick.bind(this));

            function onMatrixClick(e) {
                if (!e.target.classList.contains("matrix-cell")) return;
                e.target.select();
                setLeftBarColor("#5199DB");
            }

            function onMatrixBlur(e) {
                if (!e.target.classList.contains("matrix-cell")) return;
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
            }

            function onControlsClick(e){
                // console.dir(e.target);
                switch(e.target.id){
                    case "btn-multiply":
                        onClick_btnMultiply();
                        break;
                    case "btn-clear":
                        onClick_btnClear();
                        break;
                    case "btn-exchange":
                        onClick_btnExchange();
                        break;
                    case "btn-add-row":
                        onClick_btnAddRow();
                        break;
                    case "btn-delete-row":
                        onClick_btnDeleteRow()
                        break;
                    case "btn-add-coll":
                        onClick_btnAddColl();
                        break;
                    case "btn-delete-coll":
                        onClick_btnDeleteColl();
                        break;
                }
            }

            function onClick_btnMultiply() {
                updateElements();

                matrixC = calculateMatrixSumm(matrixA, matrixB);
                renderMatrix(matrixC, resultDiv, "readonly");
            }
            function onClick_btnClear() {
                matrixA.clear();
                matrixB.clear();
                if (matrixC) matrixC.clear();
                resetError();
                renderAll();
            }
            function onClick_btnExchange() {
                exchangeMatrices(matrixA, matrixB);

            }
            function onClick_btnAddRow() {
                switch ($('input[name=matrix-selection]:checked')[0].id) {
                    case "first-matrix-radio":
                        matrixA.addRow();
                        break;
                    case "second-matrix-radio":
                        matrixB.addRow();
                        break;
                }
            }
            function onClick_btnDeleteRow() {
                switch ($('input[name=matrix-selection]:checked')[0].id) {
                    case "first-matrix-radio":
                        matrixA.deleteRow();
                        break;
                    case "second-matrix-radio":
                        matrixB.deleteRow();
                        break;
                }
                resetError();

            }
            function onClick_btnAddColl() {
                switch ($('input[name=matrix-selection]:checked')[0].id) {
                    case "first-matrix-radio":
                        matrixA.addColl();
                        break;
                    case "second-matrix-radio":
                        matrixB.addColl();
                        break;
                }
                resetError();

            }
            function onClick_btnDeleteColl() {
                switch ($('input[name=matrix-selection]:checked')[0].id) {
                    case "first-matrix-radio":
                        matrixA.deleteColl();
                        break;
                    case "second-matrix-radio":
                        matrixB.deleteColl();
                        break;
                }
                resetError();
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
            }
            var errorDiv = calculatorElement.querySelector("#error-text");
            errorDiv.textContent = errorText;
            setLeftBarColor("none");

        }

        function resetError(){
            var errorDiv = calculatorElement.querySelector("#error-text");
            errorDiv.textContent = "";
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


            return new Matrix({
                rowsNumber: matrixA.rowsNumber,
                collsNumber: matrixB.collsNumber,
                matrixElements: resultMatrix
            });
        }


        function renderMatrix(matrix, targetElement, readonly) {
            /*generate matrix in target element*/
            // console.dir(targetElement.className);
            targetElement.innerHTML = "";

            if (!matrix) {
                //targetElement.innerHTML = "matrix = null";
                showError("not_commutative");
                return;
            }
            setLeftBarColor();
            resetError();
            var rowsNumber = matrix.rowsNumber,
                collsNumber = matrix.collsNumber;

            for (var i = 0; i < rowsNumber; i++) {
                var matrixRow = [];
                matrixRow[i] = document.createElement("div");
                matrixRow[i].classList.add('matrix-row');

                for (var k = 0; k < collsNumber; k++) {
                    var rowCells = [];
                    rowCells[k] = document.createElement("input");
                    rowCells[k].setAttribute("type", "text");

                    if (readonly) {
                        rowCells[k].setAttribute("readonly", "");
                    }
                    rowCells[k].classList.add("matrix-cell");
                    if (!matrix.matrixElements[i][k] || isNaN(matrix.matrixElements[i][k])) {
                        rowCells[k].classList.add("sell-default");
                        rowCells[k].setAttribute("value", "c" + (i + 1) + "," + (k + 1));

                    } else {
                        rowCells[k].setAttribute("value", matrix.matrixElements[i][k]);
                    }

                    matrixRow[i].appendChild(rowCells[k]);
                }

                targetElement.appendChild(matrixRow[i]);
            }


        }


        function exchangeMatrices(matrixA, matrixB) {
            var tempMatrix = matrixB;
            matrixB = matrixA;
            matrixA = tempMatrix;

            matrixA.rotateMatrix();
            matrixB.rotateMatrix();
            matrixC = calculateMatrixSumm(matrixA, matrixB);
            renderAll();
            resetError();

        }
    }

    var mCalc = new MatrixCalculator({
        calculatorElement: document.querySelector("#matrix-calculator")
    });
})();