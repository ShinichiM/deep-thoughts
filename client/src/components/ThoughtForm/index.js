import React, { useState } from "react";
import { useMutation } from "@apollo/client";
import { ADD_THOUGHT } from "../../utils/mutations";
import { QUERY_THOUGHTS, QUERY_ME_BASIC } from "../../utils/queries";

const ThoughtForm = () => {
  const [thoughtText, setThoughtText] = useState("");
  const [characterCount, setCharacterCount] = useState(0);
  const [addThought, { error }] = useMutation(ADD_THOUGHT, {
    update(cache, { data: { addThought, reactions = null } }) {
      try {
        // could potentially not exist yet in cache so wrap in try catch
        // read whats currently in the cache
        const { thoughts } = cache.readQuery({ query: QUERY_THOUGHTS });
        // prepend the newest thought to the front of the array
        cache.writeQuery({
          query: QUERY_THOUGHTS,
          data: {
            thoughts: [addThought, ...thoughts],
          },
        });
      } catch (e) {
        console.error(e);
      }

      const { me } = cache.readQuery({ query: QUERY_ME_BASIC });
      cache.writeQuery({
        query: QUERY_ME_BASIC,
        data: { me: { ...me, thoughts: [...me.thoughts, addThought] } },
      });
    },
  });

  const handleChange = (event) => {
    if (event.target.value.length <= 280) {
      setThoughtText(event.target.value);
      setCharacterCount(event.target.value.length);
    }
  };

  const handleFormSubmit = async (event) => {
    event.preventDefault();
    try {
      await addThought({
        variables: { thoughtText, reactions: {} },
      });
      setThoughtText("");
      setCharacterCount(0);
      document.location.reload();
    } catch (e) {
      console.error(e);
    }
  };
  return (
    <div>
      <p className={`m-0 ${characterCount === 280 ? "text-error" : ""}`}>
        Character Count: {characterCount}/280
        {error && <span className="ml-2">Something went wrong...</span>}
      </p>
      <form className="flex-row justify-center justify-space-between-md align-stretch">
        <textarea
          placeholder="Here's a new thought"
          value={thoughtText}
          className="form-input col-12 col-md-9"
          onChange={handleChange}
        ></textarea>
        <button
          className="btn col-12 col-md-3"
          type="submit"
          onClick={handleFormSubmit}
        >
          Submit
        </button>
      </form>
    </div>
  );
};

export default ThoughtForm;
