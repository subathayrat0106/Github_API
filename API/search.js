const request = require("./request");
const { expect } = require("chai");

/**
 * THE Github Search Repo API test
 * Using axios making API call,
 * mocha for the test run
 * chai for the result assertion
 * 'npm test' to run the test suite
 */

/**
 * helper method
 * checking the search key's value exists in the query
 * return ture as except assertion
 */
const assertResult = (data, key, value) => {
  let result;
  result = data.every((item) => {
    if (typeof item[key] === "string") {
      return item[key].toLowerCase().includes(value);
    }
    if (Array.isArray(item[key])) {
      return item[key].includes(value);
    }
  });
  expect(result).to.equal(
    true,
    `testing '${value}' keyword existed in key '${key}' of the result repo`
  );
};

/**
 * helper method
 * validate the repsonse if its gets 200 status code
 * validate the repsonse on numbers of results
 */
const statusCodeAndPage = (response, page) => {
  expect(response.status).to.equal(200, "200 Status Code");
  expect(response.data.items.length).to.equal(
    page,
    `${page} repo search results are displayed`
  );
};

/**
 * helper method
 *checking the response if the result is sorted
 */
const sortResult = (data, key) => {
  let arr;
  let result = true;
  arr = data.map((item) => {
    return item[key];
  });
  for (let i = 0; i < arr.length; i++) {
    for (let k = i + 1; k < arr.length; k++) {
      if (arr[i] < arr[k]) {
        result = false;
        break;
      }
    }
  }
  expect(result).to.equal(true, `testing sorting '${key}' of the result repo`);
};

/**
 * helper method
 * checking the response if the values are in range of the query
 */
const compareValue = (data, key, compareValue) => {
  let result;
  result = data.every((item) => {
    if (typeof item[key] === "number") {
      return item[key] >= compareValue;
    }
    if (Array.isArray(item[key])) {
      return item[key].length >= compareValue;
    }
  });
  expect(result).to.equal(
    true,
    `testing '${key}' compare to value '${compareValue}' of the result repo`
  );
};

describe("Github Search API test", async () => {
  describe("GET /search/repositories", async () => {
    const endPoint = "/search/repositories?";
    it('search repo in name "automation"', async () => {
      const queryString = "q=" + "automation" + "+in:name";
      const response = await request.HttpRquest(endPoint + queryString);
      statusCodeAndPage(response, 30);
      assertResult(response.data.items, "name", "automation");
    });
    it('search repo in description "automation"', async () => {
      const queryString = "q=" + "automation" + "+in:description";
      const response = await request.HttpRquest(endPoint + queryString);
      statusCodeAndPage(response, 30);
      assertResult(response.data.items, "description", "automation");
    });
    it('search repo name automation in language "javascript"', async () => {
      const queryString = "q=" + "automation" + "language:javascript";
      const response = await request.HttpRquest(endPoint + queryString);
      statusCodeAndPage(response, 30);
      assertResult(response.data.items, "language", "javascript");
    });
    it('search repo in name "automation" per_page=10', async () => {
      const queryString = "q=" + "automation" + "+in:name&per_page=10";
      const response = await request.HttpRquest(endPoint + queryString);
      statusCodeAndPage(response, 10);
      assertResult(response.data.items, "name", "automation");
    });
    it('search repo "automation"and sort stars', async () => {
      const queryString = "q=" + "automation" + "+in:name&sort=stars";
      const response = await request.HttpRquest(endPoint + queryString);
      statusCodeAndPage(response, 30);
      sortResult(response.data.items, "stargazers_count");
    });
    it('search repo "automation" and sort forks and per_page=20', async () => {
      const queryString =
        "q=" + "automation" + "+in:name&sort=forks&per_page=20";
      const response = await request.HttpRquest(endPoint + queryString);
      statusCodeAndPage(response, 20);
      sortResult(response.data.items, "forks_count");
    });
    it('search repo "automation" in followers>1000 per_page=10', async () => {
      const queryString =
        "q=" + "automation" + "+ followers:>=1000&per_page=10";
      const response = await request.HttpRquest(endPoint + queryString);
      statusCodeAndPage(response, 10);
      compareValue(response.data.items, "watchers_count", 1000);
    });
    it('search repo "automation" in topic "selenium" per_page=10', async () => {
      const queryString = "q=" + "automation" + "+ topic:selenium&per_page=10";
      const response = await request.HttpRquest(endPoint + queryString);
      statusCodeAndPage(response, 10);
      assertResult(response.data.items, "topics", "selenium");
    });
    it('search repo "java" in topics>3 per_page=10', async () => {
      const queryString = "q=" + "java" + "+ topics:>=3 &per_page=10";
      const response = await request.HttpRquest(endPoint + queryString);
      statusCodeAndPage(response, 10);
      compareValue(response.data.items, "topics", 3);
    });
    it('search repo "automation" in size:>=10000 per_page=10', async () => {
      const queryString = "q=" + "automation" + "+ size:>=10000&per_page=10";
      const response = await request.HttpRquest(endPoint + queryString);
      statusCodeAndPage(response, 10);
      compareValue(response.data.items, "size", 1000);
    });
  });
});
