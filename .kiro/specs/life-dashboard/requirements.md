# Requirements — Life Dashboard

## Introduction

A personal productivity dashboard delivered as a static web page.
All requirements listed here reflect the **implemented and working** state of the project.

## Glossary

| Term | Definition |
|------|-----------|
| LocalStorage | Browser-native key/value store; data persists across page refreshes |
| Pomodoro | Time-management technique using focused work intervals (default 25 min) |
| Theme | Visual colour scheme — dark (default) or light |

---

### Requirement 1: Greeting and Live Clock

**User Story:** As a user, I want to see the current date, time, and a time-appropriate greeting so that the dashboard feels personal and contextual.

#### Acceptance Criteria

1. WHEN the page loads, THEN the current date is displayed in long format (e.g. "Friday, October 23, 2026").
2. WHEN the page loads, THEN the current time is displayed and updates every second.
3. WHEN the current hour is 0–11, THEN the greeting reads "Good morning".
4. WHEN the current hour is 12–16, THEN the greeting reads "Good afternoon".
5. WHEN the current hour is 17–20, THEN the greeting reads "Good evening".
6. WHEN the current hour is 21–23, THEN the greeting reads "Good night".

---

### Requirement 2: Custom Name in Greeting

**User Story:** As a user, I want to enter my name so that the greeting addresses me personally.

#### Acceptance Criteria

1. WHEN no name is saved, THEN the greeting displays the time-based phrase followed by "!" (e.g. "Good morning!").
2. WHEN a name is saved, THEN the greeting displays the phrase, a comma, the name, and "!" (e.g. "Good morning, Alex!").
3. WHEN the user clicks "Edit name", THEN an inline input form appears.
4. WHEN the user types a name and saves it, THEN the name is written to LocalStorage under the key `dashboard_name`.
5. WHEN the user saves an empty input, THEN the stored name is removed and the greeting reverts to the default.
6. WHEN the page is refreshed, THEN the saved name is loaded from LocalStorage and applied automatically.
7. WHEN the user presses Enter in the name input, THEN the name is saved.
8. WHEN the user presses Escape in the name input, THEN the editor closes without saving.

---

### Requirement 3: Pomodoro Focus Timer

**User Story:** As a user, I want a countdown timer so that I can manage focused work sessions.

#### Acceptance Criteria

1. WHEN the page loads, THEN the timer displays 25:00 by default.
2. WHEN the user clicks Start, THEN the timer counts down one second per second.
3. WHEN the timer is running, THEN the Start button is disabled and the Stop button is enabled.
4. WHEN the user clicks Stop, THEN the countdown pauses and the Start button re-enables.
5. WHEN the user clicks Start after pausing, THEN the countdown resumes from the paused value.
6. WHEN the user clicks Reset, THEN the timer returns to the selected duration and stops.
7. WHEN fewer than 5 minutes remain, THEN the timer display turns amber.
8. WHEN fewer than 1 minute remains, THEN the timer display turns red.
9. WHEN the countdown reaches 0, THEN the timer stops automatically and shows a completion message.
10. WHEN the user changes the duration selector, THEN the timer resets immediately to the new duration.
11. WHEN Start is clicked while the timer is already running, THEN no additional interval is created (no double-speed bug).
12. The duration selector offers options: 25, 20, 15, 10, 5, and 1 minute.

---

### Requirement 4: To-Do List

**User Story:** As a user, I want to manage a task list so that I can track what needs to be done.

#### Acceptance Criteria

1. WHEN the user types a task and submits the form, THEN the task is added to the list.
2. WHEN a task is added, THEN it is saved to LocalStorage under `dashboard_todos`.
3. WHEN the page loads or refreshes, THEN all previously saved tasks are rendered from LocalStorage.
4. WHEN the user checks a task's checkbox, THEN the task is marked done with a strikethrough style.
5. WHEN the user unchecks a task, THEN the done state is removed.
6. WHEN the done state changes, THEN LocalStorage is updated immediately.
7. WHEN the user clicks the edit button on a task, THEN a modal dialog opens pre-filled with the task text.
8. WHEN the user saves the edit, THEN the task text is updated in the list and in LocalStorage.
9. WHEN the user clicks the delete button on a task, THEN the task is removed from the list and from LocalStorage.
10. WHEN the task list is empty, THEN an empty-state hint is displayed.
11. WHEN the edit modal is open and the user presses Enter, THEN the edit is saved.
12. WHEN the edit modal is open and the user presses Escape or clicks the overlay, THEN the modal closes without saving.

---

### Requirement 5: Quick Links

**User Story:** As a user, I want to save shortcut links to my favourite websites so that I can open them from the dashboard.

#### Acceptance Criteria

1. WHEN the user fills in a name and URL and submits the link form, THEN the link is added as a chip.
2. WHEN a link is added, THEN it is saved to LocalStorage under `dashboard_links`.
3. WHEN the page loads or refreshes, THEN all previously saved links are rendered from LocalStorage.
4. WHEN the user enters a URL without a protocol, THEN `https://` is prepended automatically.
5. WHEN the user enters an invalid URL, THEN an alert is shown and the link is not added.
6. WHEN the user clicks a link chip, THEN the website opens in a new tab.
7. WHEN the user clicks the × on a chip, THEN that link is removed from the list and from LocalStorage.
8. WHEN the link list is empty, THEN an empty-state hint is displayed.

---

### Requirement 6: Light / Dark Theme

**User Story:** As a user, I want to switch between light and dark colour schemes so that I can use the dashboard comfortably in different lighting conditions.

#### Acceptance Criteria

1. WHEN the page loads with no saved theme preference, THEN the dark theme is applied by default.
2. WHEN the user clicks the theme toggle button, THEN the theme switches between dark and light.
3. WHEN the light theme is active, THEN the toggle button shows a sun symbol (☀).
4. WHEN the dark theme is active, THEN the toggle button shows a crescent symbol (☽).
5. WHEN the theme changes, THEN the new preference is saved to LocalStorage under `dashboard_theme`.
6. WHEN the page is refreshed, THEN the saved theme is applied before the page is rendered (no flash of wrong theme).
7. WHEN the light theme is active, THEN all text, cards, inputs, and buttons remain readable.