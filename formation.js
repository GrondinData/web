/* =========================================================
   CONFIGURATION
========================================================= */

const TOTAL_LESSONS = 18;

const STORAGE_KEY = "formation-data-ia-progress";


/* =========================================================
   ELEMENTS
========================================================= */

const lessons = document.querySelectorAll(".lesson");

const progressFill =
    document.getElementById("progress-fill");

const progressCount =
    document.getElementById("progress-count");

const progressPercent =
    document.getElementById("progress-percent");

const moduleLinks =
    document.querySelectorAll(".module-link");


/* =========================================================
   ÉTAT
========================================================= */

let completedLessons =
    JSON.parse(
        localStorage.getItem(STORAGE_KEY) || "[]"
    );


/* =========================================================
   SAUVEGARDE
========================================================= */

function saveProgress() {

    localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(completedLessons)
    );

}


/* =========================================================
   PROGRESSION
========================================================= */

function updateProgress() {

    const completedCount =
        completedLessons.length;

    const percentage =
        Math.round(
            (completedCount / TOTAL_LESSONS) * 100
        );

    if (progressFill) {
        progressFill.style.width = `${percentage}%`;
    }

    if (progressCount) {
        progressCount.textContent =
            `${completedCount} / ${TOTAL_LESSONS} leçons`;
    }

    if (progressPercent) {
        progressPercent.textContent =
            `${percentage}%`;
    }

}


/* =========================================================
   IDENTIFIANT LEÇON
========================================================= */

function getLessonId(lesson) {

    const number =
        lesson.querySelector(".lesson-number");

    if (!number) {
        return null;
    }

    return number.textContent.trim();

}


/* =========================================================
   RESTAURATION
========================================================= */

function restoreProgress() {

    lessons.forEach(lesson => {

        const id =
            getLessonId(lesson);

        if (
            id &&
            completedLessons.includes(id)
        ) {

            lesson.classList.add("completed");

            const button =
                lesson.querySelector(
                    ".lesson-complete"
                );

            if (button) {
                button.textContent =
                    "✓ Leçon terminée";
            }

        }

    });

    updateProgress();

}


/* =========================================================
   TERMINER UNE LEÇON
========================================================= */

lessons.forEach(lesson => {

    const button =
        lesson.querySelector(
            ".lesson-complete"
        );

    if (!button) {
        return;
    }

    button.addEventListener(
        "click",
        () => {

            const id =
                getLessonId(lesson);

            if (!id) {
                return;
            }


            const alreadyCompleted =
                completedLessons.includes(id);


            if (alreadyCompleted) {

                completedLessons =
                    completedLessons.filter(
                        item => item !== id
                    );

                lesson.classList.remove(
                    "completed"
                );

                button.textContent =
                    "Marquer comme terminé";

            } else {

                completedLessons.push(id);

                lesson.classList.add(
                    "completed"
                );

                button.textContent =
                    "✓ Leçon terminée";

            }


            saveProgress();

            updateProgress();

        }
    );

});


/* =========================================================
   QUIZ
========================================================= */

document
    .querySelectorAll(".quiz")
    .forEach(quiz => {

        const options =
            quiz.querySelectorAll(
                ".quiz-option"
            );

        const submit =
            quiz.querySelector(
                ".quiz-submit"
            );

        const result =
            quiz.querySelector(
                ".quiz-result"
            );


        let selectedOption = null;


        /* ---------------------------------------------
           SELECTION
        --------------------------------------------- */

        options.forEach(option => {

            option.addEventListener(
                "click",
                () => {

                    /*
                     * Si le quiz a déjà été validé,
                     * on ne permet plus de modifier
                     * la réponse.
                     */

                    if (
                        quiz.dataset.answered === "true"
                    ) {
                        return;
                    }


                    options.forEach(item => {

                        item.classList.remove(
                            "selected"
                        );

                    });


                    option.classList.add(
                        "selected"
                    );


                    selectedOption = option;

                }
            );

        });


        /* ---------------------------------------------
           VALIDATION
        --------------------------------------------- */

        if (submit) {

            submit.addEventListener(
                "click",
                () => {

                    if (!selectedOption) {

                        result.textContent =
                            "Sélectionnez une réponse.";

                        result.className =
                            "quiz-result error";

                        return;
                    }


                    const isCorrect =
                        selectedOption.dataset.correct === "true";


                    options.forEach(option => {

                        if (
                            option.dataset.correct === "true"
                        ) {

                            option.classList.add(
                                "correct"
                            );

                        }

                    });


                    if (isCorrect) {

                        selectedOption.classList.add(
                            "correct"
                        );

                        result.textContent =
                            "Bonne réponse.";

                        result.className =
                            "quiz-result success";

                    } else {

                        selectedOption.classList.add(
                            "incorrect"
                        );

                        result.textContent =
                            "Réponse incorrecte. La bonne réponse est indiquée en vert.";

                        result.className =
                            "quiz-result error";

                    }


                    quiz.dataset.answered =
                        "true";

                    submit.disabled = true;

                }
            );

        }

    });


/* =========================================================
   NAVIGATION SIDEBAR
========================================================= */

const modules =
    document.querySelectorAll(
        ".module-section"
    );


const observer =
    new IntersectionObserver(
        entries => {

            entries.forEach(entry => {

                if (!entry.isIntersecting) {
                    return;
                }

                const id =
                    entry.target.id;


                moduleLinks.forEach(link => {

                    link.classList.remove(
                        "active"
                    );

                    if (
                        link.getAttribute("href") ===
                        `#${id}`
                    ) {

                        link.classList.add(
                            "active"
                        );

                    }

                });

            });

        },
        {
            rootMargin: "-20% 0px -65% 0px"
        }
    );


modules.forEach(module => {

    observer.observe(module);

});


/* =========================================================
   INITIALISATION
========================================================= */

restoreProgress();