"use strict";

/**
 * Grind 75 Extended - Main Logic
 */
document.addEventListener("DOMContentLoaded", () => {
    const datasource = DATA_SOURCE;
    // -------------------------------------------------------------------------
    // 1. Constants & State
    // -------------------------------------------------------------------------
    const STATE_KEY_COMPLETED = "1:completedQuestions";
    const STATE_KEY_EXTENDED = "grind75_extended_data";
    const STATE_KEY_SETTINGS = "grind75_settings";

    // Full 169 Questions - Order: "All Rounded" from Tech Interview Handbook
    // Extracted directly from the source.
    // State Variables
    let completedQuestions = [];
    let extendedData = {};
    let settings = { filterStatus: "all" };
    let allQuestions = [];
    let visibleQuestions = [];

    // -------------------------------------------------------------------------
    // 2. Data Initialization
    // -------------------------------------------------------------------------

    const init = () => {
        loadState();
        allQuestions = processQuestions(datasource); // Process data to match internal format (rank/id)
        injectSettingsUI();
        applyLogic();
        renderList();

        const filterSelect = document.getElementById("custom_status_filter");
        if (filterSelect) {
            filterSelect.addEventListener("change", (e) => {
                settings.filterStatus = e.target.value;
                renderList();
                saveState();
            });
        }
    };

    const loadState = () => {
        try {
            completedQuestions = JSON.parse(
                localStorage.getItem(STATE_KEY_COMPLETED) || "[]"
            );
        } catch (e) {}
        try {
            extendedData = JSON.parse(
                localStorage.getItem(STATE_KEY_EXTENDED) || "{}"
            );
        } catch (e) {}
        try {
            const savedSettings = JSON.parse(
                localStorage.getItem(STATE_KEY_SETTINGS) || "{}"
            );
            settings = { ...settings, ...savedSettings };
        } catch (e) {}
    };

    const saveState = () => {
        localStorage.setItem(
            STATE_KEY_COMPLETED,
            JSON.stringify(completedQuestions)
        );
        localStorage.setItem(STATE_KEY_EXTENDED, JSON.stringify(extendedData));
        localStorage.setItem(STATE_KEY_SETTINGS, JSON.stringify(settings));
        updateAllUI();
    };

    // Helper: Map JSON data to internal structure (add rank/id)
    const processQuestions = (data) => {
        return data.map((q, index) => ({
            ...q,
            id: index + 1,
            rank: index + 1, // Order is explicit from the JSON array
            duration: parseInt(q.time) || 20,
        }));
    };

    // -------------------------------------------------------------------------
    // 3. Logic & Filtering
    // -------------------------------------------------------------------------

    const applyLogic = () => {
        // Show all questions - no time-based filtering
        visibleQuestions = [...allQuestions];
    };

    // -------------------------------------------------------------------------
    // 4. UI Rendering
    // -------------------------------------------------------------------------

    const injectSettingsUI = () => {
        let controls = document.getElementById("grind-controls");
        if (!controls) return;

        // Ensure showTopics is initialized
        if (typeof settings.showTopics === "undefined")
            settings.showTopics = true;

        const filterLabels = {
            all: "All Questions",
            done: "Completed",
            not_done: "Incomplete",
            retry: "To Retry",
        };
        const currentLabel =
            filterLabels[settings.filterStatus] || "All Questions";

        // Clear existing to avoid duplication if re-injected
        controls.innerHTML = "";

        controls.innerHTML = `
            <div class="flex flex-col md:flex-row items-center justify-between pt-4 pb-4">
               <div class="flex items-center space-x-6 mb-4 md:mb-0">
                    
                    <!-- Topics Toggle -->
                    <div class="flex items-center">
                        <label class="flex items-center cursor-pointer relative">
                            <input type="checkbox" id="topic-toggle" class="sr-only" ${
                                settings.showTopics ? "checked" : ""
                            }>
                            <div class="w-9 h-5 bg-gray-200 rounded-full shadow-inner toggle-bg transition-colors duration-200 ease-in-out ${
                                settings.showTopics ? "bg-indigo-600" : ""
                            }"></div>
                            <div class="dot absolute left-0.5 top-0.5 w-4 h-4 bg-white rounded-full transition transform duration-200 ease-in-out ${
                                settings.showTopics ? "translate-x-full" : ""
                            }"></div>
                            <span class="ml-2 text-sm text-gray-500 font-medium select-none">Show Topics</span>
                        </label>
                    </div>
               </div>
               
               <div class="flex items-center space-x-4 relative z-10">
                   <!-- Custom Filter Dropdown -->
                   <div class="relative inline-block text-left">
                      <div>
                        <button type="button" id="filter-button" class="inline-flex justify-center w-full rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500" aria-haspopup="true" aria-expanded="true">
                          <span id="filter-label">${currentLabel}</span>
                          <svg class="-mr-1 ml-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                            <path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd" />
                          </svg>
                        </button>
                      </div>
                      <div id="filter-dropdown" class="origin-top-right absolute right-0 mt-2 w-40 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 hidden focus:outline-none z-50">
                        <div class="py-1">
                          <a href="#" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900" data-value="all">All Questions</a>
                          <a href="#" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900" data-value="done">Completed</a>
                          <a href="#" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900" data-value="not_done">Incomplete</a>
                          <a href="#" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900" data-value="retry">To Retry</a>
                        </div>
                      </div>
                    </div>
               </div>
            </div>
            <style>
                .toggle-bg.bg-indigo-600 { background-color: #4f46e5; }
                .translate-x-full { transform: translateX(100%); }
            </style>
        `;

        // Topic Toggle
        const topicToggle = document.getElementById("topic-toggle");
        if (topicToggle) {
            topicToggle.addEventListener("change", (e) => {
                settings.showTopics = e.target.checked;
                const bg = e.target.parentElement.querySelector(".toggle-bg");
                const dot = e.target.parentElement.querySelector(".dot");
                if (settings.showTopics) {
                    bg.classList.add("bg-indigo-600");
                    dot.classList.add("translate-x-full");
                } else {
                    bg.classList.remove("bg-indigo-600");
                    dot.classList.remove("translate-x-full");
                }
                renderList();
                saveState();
            });
        }

        // Filter Dropdown Handlers
        const filterBtn = document.getElementById("filter-button");
        const filterMenu = document.getElementById("filter-dropdown");
        const filterLabel = document.getElementById("filter-label");

        if (filterBtn && filterMenu) {
            filterBtn.addEventListener("click", (e) => {
                e.stopPropagation();
                filterMenu.classList.toggle("hidden");
            });

            filterMenu.querySelectorAll("a").forEach((item) => {
                item.addEventListener("click", (e) => {
                    e.preventDefault();
                    settings.filterStatus = e.target.getAttribute("data-value");
                    filterLabel.textContent = e.target.textContent;
                    filterMenu.classList.add("hidden");
                    renderList();
                    saveState();
                });
            });
        }
    };

    const renderList = () => {
        const listContainer = document.getElementById("questions-list");
        if (!listContainer) return;

        listContainer.innerHTML = "";

        const finalDisplay = visibleQuestions.filter((q) => {
            const slug = getSlug(q.url);
            const isDone = completedQuestions.includes(slug);
            const retries = extendedData[slug]?.retries || 0;

            if (settings.filterStatus === "done" && !isDone) return false;
            if (settings.filterStatus === "not_done" && isDone) return false;
            if (settings.filterStatus === "retry" && retries === 0)
                return false;
            return true;
        });

        if (finalDisplay.length === 0) {
            listContainer.innerHTML = `<div class="p-8 text-center text-gray-500">No questions match your settings.</div>`;
            updateAllUI();
            return;
        }

        finalDisplay.forEach((q) => {
            const slug = getSlug(q.url);
            const item = createQuestionElement(q, slug);
            listContainer.appendChild(item);
        });

        updateAllUI();
    };

    const createQuestionElement = (q, slug) => {
        const isDone = completedQuestions.includes(slug);
        const retries = extendedData[slug]?.retries || 0;
        const noteText = extendedData[slug]?.notes || "";

        // Main container for the list item
        const outer = document.createElement("div");
        outer.className =
            "block bg-white hover:bg-gray-50 transition-colors duration-150 ease-in-out border-b border-gray-200";

        // 1. The Question Row
        const item = document.createElement("div");
        item.className = `flex items-center text-sm font-medium px-4 md:px-6 py-4 ${
            isDone ? "bg-emerald-50 text-gray-500" : "text-gray-600"
        } transition-colors duration-150`;
        item.dataset.slug = slug;
        item.dataset.url = q.url;

        // Rank
        const rankDiv = document.createElement("div");
        rankDiv.className =
            "shrink-0 w-8 md:w-10 text-center font-bold text-gray-300 select-none mr-4";
        rankDiv.innerText = q.rank;

        // Content (Title, Meta)
        const contentDiv = document.createElement("div");
        contentDiv.className = "flex-1 min-w-0 mr-4 cursor-pointer";
        contentDiv.onclick = () => window.open(q.url, "_blank");

        // Title Row
        const titleRow = document.createElement("div");
        titleRow.className = "flex items-center justify-between";
        const titleSpan = document.createElement("span");
        titleSpan.className = `truncate text-base ${
            isDone ? "line-through text-gray-400" : "text-gray-900"
        }`;
        titleSpan.innerText = q.title;
        titleRow.appendChild(titleSpan);

        // Metadata Row
        const metaRow = document.createElement("div");
        metaRow.className =
            "flex items-center space-x-2 text-xs md:text-sm mt-1";

        const diffSpan = document.createElement("span");
        diffSpan.className = getDifficultyClassTextColor(q.difficulty);
        diffSpan.innerText = q.difficulty;

        const timeSpan = document.createElement("span");
        timeSpan.innerText = `${q.duration} mins`;

        // Topic Badge
        const topicSpan = document.createElement("span");
        topicSpan.className =
            "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 hidden sm:inline-flex";
        topicSpan.innerText = q.topic;
        if (!settings.showTopics) topicSpan.style.display = "none";

        const sep1 = document.createElement("span");
        sep1.className = "text-gray-300";
        sep1.innerText = "·";
        const sep2 = document.createElement("span");
        sep2.className = "text-gray-300 hidden sm:inline";
        sep2.innerText = "·";

        metaRow.appendChild(diffSpan);
        metaRow.appendChild(sep1);
        metaRow.appendChild(timeSpan);
        if (q.topic && settings.showTopics) {
            metaRow.appendChild(sep2);
            metaRow.appendChild(topicSpan);
        }

        contentDiv.appendChild(titleRow);
        contentDiv.appendChild(metaRow);

        // NEW: Notes Column
        const notesDisplayCol = document.createElement("div");
        notesDisplayCol.className =
            "hidden md:flex shrink-0 w-1/4 px-2 border-l border-gray-100 ml-2 h-full flex-col justify-center";
        if (noteText) {
            const noteContainer = document.createElement("div");
            noteContainer.className =
                "flex items-start justify-between w-full group";

            const textSpan = document.createElement("span");
            textSpan.className =
                "text-xs text-gray-500 italic truncate cursor-pointer";
            textSpan.title = noteText;
            textSpan.innerText = noteText;
            // Allow clicking note to toggle edit?
            textSpan.onclick = (e) => {
                e.stopPropagation();
                toggleNotes(outer, slug);
            };

            const delBtn = document.createElement("button");
            delBtn.className =
                "ml-1 text-gray-300 hover:text-red-500 hidden group-hover:block focus:outline-none";
            delBtn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" /></svg>`;
            delBtn.onclick = (e) => {
                e.stopPropagation();
                deleteNote(slug, null, outer);
            }; // Pass outer to refresh

            noteContainer.appendChild(textSpan);
            noteContainer.appendChild(delBtn);
            notesDisplayCol.appendChild(noteContainer);
        }

        // Actions (Right side)
        const actionsDiv = document.createElement("div");
        actionsDiv.className = "shrink-0 flex items-center space-x-2 ml-4";

        // Done Button
        const doneBtn = document.createElement("button");
        doneBtn.className = `inline-flex items-center border border-transparent p-1 rounded-full focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-indigo-500 ${
            isDone ? "text-emerald-500" : "text-gray-300 hover:text-gray-400"
        }`;
        doneBtn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>`;
        doneBtn.title = isDone ? "Mark as Incomplete" : "Mark as Complete";
        doneBtn.onclick = (e) => {
            e.stopPropagation();
            toggleDone(slug);
        };

        // Retry Button with Count
        const retryWrapper = document.createElement("div");
        retryWrapper.className = "relative group flex items-center";

        const retryBtn = document.createElement("button");
        retryBtn.className = `p-1 rounded-full hover:bg-gray-100 focus:outline-none transition-colors ${
            retries > 0 ? "text-red-500" : "text-gray-300 hover:text-red-500"
        }`;
        retryBtn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>`;
        retryBtn.title = `Retried ${retries} times`;
        retryBtn.onclick = (e) => {
            e.stopPropagation();
            incrementRetry(slug);
        };

        // Count Badge
        const retryCount = document.createElement("span");
        retryCount.className = `retry-count text-xs font-semibold ml-1 ${
            retries > 0 ? "text-red-600" : "hidden"
        }`;
        retryCount.innerText = retries;

        const resetBtn = document.createElement("button");
        resetBtn.className = `${
            retries > 0 ? "block" : "hidden"
        } absolute -top-1 -right-1 bg-white text-gray-500 hover:text-red-600 rounded-full border shadow-sm p-0.5 transform scale-75 opacity-0 group-hover:opacity-100 transition-opacity`;
        resetBtn.innerHTML = `<svg class="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>`;
        resetBtn.title = "Reset Retries";
        resetBtn.onclick = (e) => {
            e.stopPropagation();
            resetRetry(slug);
        };

        retryWrapper.appendChild(retryBtn);
        // retryWrapper.appendChild(retryCount); // Layout choice: count next to btn or badge?
        // Let's make it part of the button or next to it.
        // Wrapper is flex items-center.
        retryWrapper.appendChild(retryCount);
        retryWrapper.appendChild(resetBtn);

        // Notes Button
        const notesBtn = document.createElement("button");
        notesBtn.className = `p-1 rounded-full hover:bg-gray-100 focus:outline-none transition-colors ml-2 ${
            noteText ? "text-indigo-500" : "text-gray-300 hover:text-indigo-500"
        }`;
        notesBtn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>`;
        notesBtn.onclick = (e) => {
            e.stopPropagation();
            toggleNotes(outer, slug);
        };

        actionsDiv.appendChild(doneBtn);
        actionsDiv.appendChild(retryWrapper);
        actionsDiv.appendChild(notesBtn);

        item.appendChild(rankDiv);
        item.appendChild(contentDiv);
        item.appendChild(notesDisplayCol);
        item.appendChild(actionsDiv);

        // 2. Notes Area (Hidden by default)
        const notesArea = document.createElement("div");
        notesArea.className =
            "hidden w-full pl-4 md:pl-20 pr-4 pb-4 bg-gray-50 border-t border-gray-100";
        notesArea.innerHTML = `
            <label class="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-1 mt-2">Notes</label>
            <textarea class="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md" rows="3"></textarea>
            <div class="mt-2 flex justify-between">
                <button class="save-note inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none">Save Note</button>
                <button class="delete-note inline-flex items-center px-3 py-1.5 text-xs font-medium text-red-600 hover:text-red-800 focus:outline-none">Delete Note</button>
            </div>
         `;
        notesArea.querySelector(".save-note").onclick = () =>
            saveNote(slug, notesArea.querySelector("textarea").value, outer);
        notesArea.querySelector(".delete-note").onclick = () =>
            deleteNote(slug, notesArea.querySelector("textarea"), outer);

        outer.appendChild(item);
        outer.appendChild(notesArea);

        return outer;
    };

    // Helper to get text color class
    const getDifficultyClassTextColor = (d) => {
        if (d === "Easy") return "text-emerald-500";
        if (d === "Medium") return "text-yellow-600";
        if (d === "Hard") return "text-red-600";
        return "text-gray-500";
    };

    const getDifficultyClass = (d) => {
        if (d === "Easy") return "bg-emerald-100 text-emerald-800";
        if (d === "Medium") return "bg-yellow-100 text-yellow-800";
        if (d === "Hard") return "bg-red-100 text-red-800";
        return "bg-gray-100 text-gray-800";
    };

    const getSlug = (url) => {
        if (!url) return null;
        const p = url.split("/");
        return p[p.length - 1] || p[p.length - 2];
    };

    const toggleDone = (slug) => {
        const i = completedQuestions.indexOf(slug);
        if (i > -1) completedQuestions.splice(i, 1);
        else completedQuestions.push(slug);
        saveState();
    };

    const incrementRetry = (slug) => {
        if (!extendedData[slug]) extendedData[slug] = {};
        extendedData[slug].retries = (extendedData[slug].retries || 0) + 1;
        saveState();
    };

    const resetRetry = (slug) => {
        if (extendedData[slug]) {
            extendedData[slug].retries = 0;
            saveState();
        }
    };

    const toggleNotes = (outer, slug) => {
        const notesArea = outer.lastElementChild;
        if (notesArea) {
            notesArea.classList.toggle("hidden");
            if (!notesArea.classList.contains("hidden")) {
                const ta = notesArea.querySelector("textarea");
                if (ta) {
                    ta.value = extendedData[slug]?.notes || "";
                    ta.focus();
                }
            }
        }
    };

    const saveNote = (slug, text, outer) => {
        if (!extendedData[slug]) extendedData[slug] = {};
        extendedData[slug].notes = text;
        saveState();
        renderList();
    };

    const deleteNote = (slug, area, outer) => {
        if (confirm("Remove note?")) {
            if (extendedData[slug]) delete extendedData[slug].notes;
            saveState();
            if (area) area.value = "";
            renderList();
        }
    };

    const updateAllUI = () => {
        const listContainer = document.getElementById("questions-list");
        if (!listContainer) return;

        // Loop through direct children (outer divs)
        Array.from(listContainer.children).forEach((outer) => {
            const item = outer.firstElementChild; // The question row
            if (!item) return;

            const slug = item.dataset.slug;
            if (!slug) return;

            const isDone = completedQuestions.includes(slug);
            const retries = extendedData[slug]?.retries || 0;

            // Done Status UI
            if (isDone) {
                item.classList.remove("text-gray-600");
                item.classList.add("bg-emerald-50", "text-gray-500");
            } else {
                item.classList.remove("bg-emerald-50", "text-gray-500");
                item.classList.add("text-gray-600");
            }

            // Update title text strikethrough and color
            const titleSpan = item.querySelector(".truncate.text-base");
            if (titleSpan) {
                if (isDone) {
                    titleSpan.classList.remove("text-gray-900");
                    titleSpan.classList.add("line-through", "text-gray-400");
                } else {
                    titleSpan.classList.remove("line-through", "text-gray-400");
                    titleSpan.classList.add("text-gray-900");
                }
            }

            // Update Done Button
            const doneBtn = item.querySelector('button[title*="Mark"]');
            if (doneBtn) {
                doneBtn.className = `inline-flex items-center border border-transparent p-1 rounded-full focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-indigo-500 ${
                    isDone
                        ? "text-emerald-500"
                        : "text-gray-300 hover:text-gray-400"
                }`;
                doneBtn.title = isDone
                    ? "Mark as Incomplete"
                    : "Mark as Complete";
            }

            // Retry UI
            const retryWrapper = item.querySelector(".relative.group");
            if (retryWrapper) {
                const retryBtn = retryWrapper.querySelector(
                    'button[title*="Retried"]'
                );
                if (retryBtn) {
                    retryBtn.className = `p-1 rounded-full hover:bg-gray-100 focus:outline-none transition-colors ${
                        retries > 0
                            ? "text-red-500"
                            : "text-gray-300 hover:text-red-500"
                    }`;
                    retryBtn.title = `Retried ${retries} times`;
                }

                const retryCount = retryWrapper.querySelector(".retry-count");
                if (retryCount) {
                    retryCount.innerText = retries;
                    retryCount.className = `retry-count text-xs font-semibold ml-1 ${
                        retries > 0 ? "text-red-600" : "hidden"
                    }`;
                }

                const resetBtn = retryWrapper.querySelector(
                    'button[title="Reset Retries"]'
                );
                if (resetBtn) {
                    resetBtn.className = `${
                        retries > 0 ? "block" : "hidden"
                    } absolute -top-1 -right-1 bg-white text-gray-500 hover:text-red-600 rounded-full border shadow-sm p-0.5 transform scale-75 opacity-0 group-hover:opacity-100 transition-opacity`;
                }
            }
        });

        // Progress Bar Update
        const total = visibleQuestions.length;
        const done = visibleQuestions.filter((q) =>
            completedQuestions.includes(getSlug(q.url))
        ).length;
        const text = document.getElementById("progress-text");
        if (text) text.textContent = `Completed ${done} / ${total}`;

        const bar = document.querySelector('[role="progressbar"]');
        if (bar)
            bar.style.transform = `translateX(-${
                total > 0 ? 100 - (done / total) * 100 : 100
            }%)`; // Standard tailwind progress bar often uses width, but let's stick to what worked or check HTML.
        // Original HTML had style="width: 0%". Let's use width.
        if (bar) {
            const pct = total > 0 ? (done / total) * 100 : 0;
            bar.style.width = `${pct}%`;
        }
    };

    init();
});
