// The purpose of the fetcher is to abstract away our http fetching mechanism
// Because we have some hooks that needs this
// (otherwise if its not abstracted away us going to be a lot of manual work)

// This will do a fetch call for us but in abstract away
// first arg will be a URL and that's going to be a string
// second arg will be data and that could be undefined if you don't pass it, you don't need it(if you try to JSON.stringify undefined it doesnt get set whereas if it was null, it tries to do something else)
export default function fetcher(url: string, data = undefined) {
  // fetch is the new mechanism to interact with APIs and Http calls
  // When you deploy your nextjs app, your API it's mounted on the same domain as your front end app
  // We can get that by using the window object - bascially whenever the domain is that you're on when you deploy this to some plantform
  return fetch(`${window.location.origin}/api${url}`, {
    method: data ? 'POST' : 'GET',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  }).then((res) => {
    if (res.status > 399 && res.status < 200) {
      throw new Error()
    }
    return res.json()
  })
}

// This makes the pages on the front end(the forms) to signin and signup
// And restrict access to the actual music player for those users who have an account
// Then all the things that go with that detecting if the jwt is still good
