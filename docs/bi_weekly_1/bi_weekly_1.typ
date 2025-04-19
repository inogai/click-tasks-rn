#set page(margin: (top: 2cm, left: 2cm, right: 2cm, bottom: 2cm))

// credits: /u/Eric
// https://forum.typst.app/t/how-to-pagebreak-before-an-heading-only-if-a-certain-condition-is-achieved/1691/17
#show heading: it => {
  let threshold = 30%
  block(breakable: false, height: threshold)
  v(-threshold)
  it
}


#set heading(numbering: "1.")

// add a border for images
#show image: rect

#show raw: it => { highlight(fill: rgb(luma(231)),radius:2pt)[#it] }

#align(center)[
  #text(size: 16pt, weight: "bold")[COMP4521 Mobile Application Development]

  #text(size: 14pt, weight: "bold")[Bi-Weekly Report 1]
]

*Project topic:* Voice Tasks - A Better Personal Productivity App

*Group number:* Group 14

*Group members:*
- CHEN Weiqi (20845406)
- CHEN Lok Yan (20959752)

*Date:* 14-Apr-2025

= Milestones

We have been working on to verify our tech stack choice and developing the basic features of our application.

Majority of the milestones are completed as planned,
while some tasks are a bit behind the schedule.

They are expected to be completed with in next week.

#table(
  columns: (auto, auto, auto, auto),
  inset: 10pt,
  align: horizon,
  [*Task*], [*Date*], [*Assignee*], [*Progress*],
  [Create a minimal demo to verify tech stack choice], [3-Apr], [A], [V],
  [Basic to-do list], [6-Apr], [A], [V],
  [Voice recognition for to-do list], [6-Apr], [W], [WIP],
  [Basic alarm & notifications], [13-Apr], [W], [V],
  [Basic Expenses Log], [13-Apr], [A], [WIP],
  [Basic Feeling Journal], [13-Apr], [W], [WIP],
  [Bi-Weekly Report], [13-Apr], [], [V],
)

= Progress Summary - Platform

We have verified the following libraries/platform to use for our application.

== Framework

React Native + Expo

== Database

- `react-native-mmkv` for key-value perference storage
- `realm-js` for mass data storage and query

== UI

We developed our UI based on `react-native-reusables` and `lucide-icons`.

== Notifications

We employed `notifee` for persisted notifications.

= Progress Summary - Features

== Calendar Strip

We have written a collaspable calendar strip for user to select date.

#grid(
  columns: (1fr, 1fr),
  rows: (200pt),
  align: horizon,
  figure(
    caption: "Calendar Strip Collapsed",
    image("calendar_strip.png")
  ),
  figure(
    caption: "Calendar Strip Expanded",
    image("calendar_strip_expanded.png"),
  ),
)

== Timeline

We have written a timeline component to display the planned tasks for the day.

#figure(
  caption: "Timeline",
  image("timeline.png", height: 100pt)
)

== Task Create/Edit

We have built simple forms using `react-hook-forms` for creating and editing tasks.

#grid(
  columns: (1fr, 1fr),
  rows: (200pt),
  figure(
    caption: "Task Create",
    image("task_create.png")
  ),
  figure(
    caption: "Task Edit",
    image("task_edit.png"),
  ),
) 

#pagebreak()

== Navigation

We have implemented a drawer navigation using `react-navigation`.

#figure(
  caption: "Drawer Navigation",
  image("navigation.png", height: 200pt)
)

== Preference

We have implemented a preference page for user to set their preferences.

We implemented colorscheme change with `expo` and `nativewind`.

We implemented language change with `i18next`.

#grid(
  columns: (1fr, 1fr, 1fr),
  rows: (200pt),
  figure(
    caption: "Preference Page",
    image("preference.png")
  ),
  figure(
    caption: "Preference Page (Dark)",
    image("preference_dark.png"),
  ),
  figure(
    caption: "Preference Page (Chinese)",
    image("preference_chinese.png"),
  ),
)

== Timed Notifications

We have implemented basic timed notifications for tasks with `notifee`.

#figure(
  caption: "Timed Notifications",
  image("notifications.png", height: 200pt)
)

= Challenges and Action Taken

== Calendar Strip

Calendar strip from `react-native-calendars` is very unperformant and lags the app.

*Action Taken:* We have built our own calendar strip component from scratch instead.

== Notifications

Notifications work quite a bit differently on iOS and Android.

*Action Taken:* We found `notifee` library works well for both platforms. We can write simple wrapper to abstract the differences away.

== Infinite Rerendering

Sometimes accidental infinite rerendering occurs when using `react-hook-forms`.

*Action Taken:* We revert code step by step to find the culprit, then apply proper update rules / ordering / correct the logic.
