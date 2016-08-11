(function(global) {
    function MatrixCalculator(options) {

        function Matrix(options) {
            this.rowsNumber = options.rowsNumber;
            this.collsNumber = options.collsNumber;
            this.matrixElements = options.matrixElements || createElementsArray(options.rowsNumber, options.collsNumber);
            this.targetElement = null;
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

            this.updateElements = function() {
                /*get elements from inputs*/
                for (var i = 0; i < self.rowsNumber; i++) {
                    self.matrixElements[i] = [];
                }

                var matrixCells = this.targetElement.querySelectorAll(".matrix-cell");
                for (i = 0; i < matrixCells.length; i++) {
                    var positionInRow = i % self.collsNumber;
                    var rowNumber = Math.floor(i / self.collsNumber);

                    self.matrixElements[rowNumber][positionInRow] = matrixCells[i].value;
                }
                return self;
            };

            this.rotateMatrix = function() {
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

            this.addRow = function() {
                if (self.rowsNumber == MAX_SIZE) return;
                self.rowsNumber++;
                self.matrixElements.push([]);
            };

            this.deleteRow = function() {
                if (self.rowsNumber <= MIN_SIZE) return;
                self.rowsNumber--;
                self.matrixElements.pop();
            };

            this.addColl = function() {
                if (self.collsNumber == MAX_SIZE) return;
                self.collsNumber++;
                for (var i = 0; i < self.rowsNumber; i++) {
                    self.matrixElements[i].push(null);
                }
            };

            this.deleteColl = function() {
                if (self.collsNumber <= MIN_SIZE) return;
                self.collsNumber--;

                for (var i = 0; i < self.rowsNumber; i++) {
                    self.matrixElements[i].pop();
                }
            };

            this.clear = function() {
                self.matrixElements = createElementsArray(self.rowsNumber, self.collsNumber);
            };

            this.link = function(targetElement){
                this.targetElement = targetElement;
            }
        }

        var DEFAULT_FIRST = 3,
            DEFAULT_SECOND = 2,
            DEFAULT_THIRD = 4,
            MAX_SIZE = 10,
            MIN_SIZE = 2,
            MAX_VALUE = 10,

            calculatorElement = options.calculatorElement,
            resultDiv = calculatorElement.querySelector(".result-matrix .matrix"),
            matrixADiv = calculatorElement.querySelector(".first-matrix .matrix"),
            matrixBDiv = calculatorElement.querySelector(".second-matrix .matrix"),
            controls = calculatorElement.querySelector(".left-bar"),
            matrices = calculatorElement.querySelector(".right-bar"),

            matrixA = new Matrix({
                rowsNumber: DEFAULT_FIRST,
                collsNumber: DEFAULT_SECOND
            }),
            matrixB = new Matrix({
                rowsNumber: DEFAULT_SECOND,
                collsNumber: DEFAULT_THIRD
            }),
            matrixC;

        if (options.matrixA) matrixA = new Matrix(options.matrixA);
        if (options.matrixB) matrixB = new Matrix(options.matrixB);
        matrixC = calculateMatrixSumm(matrixA,matrixB);

        var currentMatrix = matrixA;


        linkMatrices();
        addListeners();
        renderAll();
        checkButtonsState();

        function linkMatrices(){
            matrixA.link(matrixADiv);
            matrixB.link(matrixBDiv);
        }

        function addListeners() {
            matrices.addEventListener("click",onMatrixClick.bind(this));
            matrices.addEventListener("blur",onMatrixBlur.bind(this),true);
            controls.addEventListener("click",onControlsClick.bind(this));
            controls.addEventListener("change",onRadioChange.bind(this));

            function onMatrixClick(e) {
                if (!e.target.classList.contains("matrix-cell") || e.target.hasAttribute("readonly")) {
                    controls.classList.remove("left-bar--editing");
                    return;
                }

                e.target.select();
                controls.classList.add("left-bar--editing");
            }

            function onMatrixBlur(e) {
                if (!e.target.classList.contains("matrix-cell") || e.target.hasAttribute("readonly")) return;

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
                updateElements();
            }

            function onRadioChange(e){
                switch(e.target.id) {
                    case "first-matrix-radio":
                        currentMatrix = matrixA;
                        break;
                    case "second-matrix-radio":
                        currentMatrix = matrixB;
                        break;
                }
                checkButtonsState();
            }

            function onControlsClick(e){
                // console.dir(e.target);
                if(e.target.classList.contains("btn-disabled")) return;

                switch(e.target.id){
                    case "btn-multiply":
                        updateElements();
                        matrixC = calculateMatrixSumm(matrixA, matrixB);
                        renderMatrix(matrixC, resultDiv, "readonly");
                        break;
                    case "btn-clear":
                        matrixA.clear();
                        matrixB.clear();
                        if (matrixC) matrixC.clear();
                        resetError();
                        renderAll();
                        break;
                    case "btn-exchange":
                        exchangeMatrices();
                        break;
                    case "btn-add-row":
                        currentMatrix.addRow();
                        resetError();
                        break;
                    case "btn-delete-row":
                        currentMatrix.deleteRow();
                        resetError();
                        break;
                    case "btn-add-coll":
                        currentMatrix.addColl();
                        resetError();
                        break;
                    case "btn-delete-coll":
                        currentMatrix.deleteColl();
                        resetError();
                        break;
                }
                renderAll();
                checkButtonsState();
            }

        }

        function updateElements() {
            matrixA.updateElements();
            matrixB.updateElements();
        }

        function renderAll() {
            renderMatrix(matrixA, matrixADiv);
            renderMatrix(matrixB, matrixBDiv);
            renderMatrix(matrixC, resultDiv, "readonly");
        }

        function showError(errorName) {
            var errorText = '';
            switch (errorName) {
                case "not_commutative":
                    errorText = "Такие матрицы нельзя умножить, так как количесво столбцов матрицы А " +
                        "не равно количеству строк матрицы В.";
                    controls.classList.add("left-bar--error");
                    break;
            }
            var errorDiv = calculatorElement.querySelector("#error-text");
            errorDiv.textContent = errorText;
        }

        function resetError(){
            var errorDiv = calculatorElement.querySelector("#error-text");
            errorDiv.textContent = "";
            controls.classList.remove("left-bar--error");
        }

        function calculateMatrixSumm(matrixA, matrixB) {
            var resultMatrix = [];
            var iNumber;
            if (matrixA.collsNumber == matrixB.rowsNumber) {
                iNumber = matrixA.collsNumber;
                resultMatrix = createElementsArray(matrixA.rowsNumber, matrixB.collsNumber);
            } else return;

            function createElementsArray(rows, colls) {
                var elements = [];
                for (var i = 0; i < rows; i++) {
                    var newRow = [];
                    elements[i] = newRow;
                    for (var j = 0; j < colls; j++) {
                        newRow[j] = calculateElement(i, j);
                    }
                }
                return elements;
            }

            function calculateElement(i, j) {
                var result = 0;
                for (var k = 0; k < iNumber; k++) {
                    result += matrixA.matrixElements[i][k] * matrixB.matrixElements[k][j];
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

            if (!matrix) {
                showError("not_commutative");
                return;
            }
            targetElement.innerHTML = "";
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

        function exchangeMatrices() {
            var tempMatrix = matrixB,
                tempElement;
            matrixB = matrixA;
            matrixA = tempMatrix;
            tempElement = matrixB.targetElement
            matrixB.link(matrixA.targetElement);
            matrixA.link(tempElement);

            matrixA.rotateMatrix();
            matrixB.rotateMatrix();
            var resultMatrix = calculateMatrixSumm(matrixA, matrixB);
            if (resultMatrix) matrixC = resultMatrix;
            renderAll();
            resetError();
        }

        function checkButtonsState(){
            if(currentMatrix.rowsNumber >= MAX_SIZE) {
                controls.querySelector('#btn-add-row').classList.add("btn-disabled");
            } else {
                controls.querySelector('#btn-add-row').classList.remove("btn-disabled");
            }
            if(currentMatrix.rowsNumber <= MIN_SIZE) {
                controls.querySelector('#btn-delete-row').classList.add("btn-disabled");
            } else {
                controls.querySelector('#btn-delete-row').classList.remove("btn-disabled");
            }
            if(currentMatrix.collsNumber >= MAX_SIZE) {
                controls.querySelector('#btn-add-coll').classList.add("btn-disabled");
            } else {
                controls.querySelector('#btn-add-coll').classList.remove("btn-disabled");
            }
            if(currentMatrix.collsNumber <= MIN_SIZE) {
                controls.querySelector('#btn-delete-coll').classList.add("btn-disabled");
            } else {
                controls.querySelector('#btn-delete-coll').classList.remove("btn-disabled");
            }

        }
    }

    global.$mCalc = new MatrixCalculator({
        calculatorElement: document.querySelector("#matrix-calculator"),
        matrixA:{
            rowsNumber: 3,
            collsNumber: 2,
            matrixElements:
                [[1, 2],
                [3, 4],
                [5, 6]]
        },
        matrixB:{
            rowsNumber: 2,
            collsNumber: 4,
            matrixElements:
                [[1, 2, 3, 4],
                [5, 6, 7, 8]]
        }
    });
})(window);