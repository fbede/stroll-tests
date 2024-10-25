# Strategy

## In summary
This is what happens per region;

Question 1 is assigned todays date -> users view question 1 -> interval passes

Question 2 is assigned todays date -> users view question 2 -> interval passes

Question N is assigned todays date -> users view question N -> interval passes

Question 1 is assigned todays date again (because all questions have been assigned and question 1 has the oldest `last assignment date`) -> users view question 1 (because the endpoint fetches the questions with the latest date for the user) -> interval passes.

## In Detail
To implement the question rotation strategy, I added two extra columns to the database. A column for region and a column for the last date and time a question was assigned. The rotation works by running a cronjob using an interval that can be specified from an endpoint. The default interval is a period of 7 days but any number of days can be specified by using the /assigned-questions/{interval} endpoint.

When the cronjob runs, it loops through the available countries and assigns questions to them starting from questions that have not been assigned before. If all the questions have already been assigned, it fetches the oldest question assigned to the country and updates the `last assignment date` to the current date and time. If there is no new question left and no questions previously assigned to the country, it logs it in the console that there were no valid questions found to assign to the country. This was done to ensure that users in different countries would never receive the same questions.

To complete the rotation, the endpoint that fetches the assigned-question for a region always fetches the question with the latest `last assignment date`. Hereby completing the circle.

## Pros
- The algorithm scales with the number of regions not with the number of users so it is easy on hardware.
- It is easy to understand, explain and debug.
- It is a platform agnostic solution

## Cons
- It may create spikes in server load especially when the cronjob runs.