import axios from "axios";
import { MANCERKEY, MANCERURL } from "./config.js";

async function convertJAIkotoMancer(body) {
  let mancerformat = {
    "prompt": body.prompt,
    "max_new_tokens": body.max_length === 0 ? 1000 : body.max_length,
    "do_sample": true,
    "temperature": body.temperature,
    "top_p": body.top_p || 0.9,
    "typical_p": body.typical_p || 0.9,
    "repetition_penalty": body.rep_pen,
    "repetition_penalty_range": 0,
    "encoder_repetition_penalty": 0.9,
    "top_k": body.top_k || 0,
    "min_length": 0,
    "no_repeat_ngram_size": 0,
    "num_beams": 1,
    "penalty_alpha": 0,
    "length_penalty": 1,
    "early_stopping": false,
    "seed": -1,
    "add_bos_token": true,
    "stopping_strings": [
      "\nYou:"
    ],
    "truncation_length": body.max_context_length,
    "ban_eos_token": false,
    "skip_special_tokens": true,
    "top_a": body.top_a || 0,
    "tfs": body.tfs || 1,
    "epsilon_cutoff": 0,
    "eta_cutoff": 0,
    "mirostat_mode": 0,
    "mirostat_tau": 5,
    "mirostat_eta": 0.1,
    "use_mancer": true
  }
  // console.log(mancerformat)
  return mancerformat
}

async function postAsync(url, args, header) {
  // console.log(args);
  try {
    const response = await axios.post(url, args, header);
    if (response.status === 200) {
      const data = await response.data;
      return data;
    }
    throw response;
  } catch (e) {
    console.log(e);
  }
}

async function mancer_generate(request, response_generate = response) {
  if (!request.body) return response_generate.sendStatus(400);
  console.log("generating text...")
  var start = Date.now();
  // code

  let config = {
    headers: {
      "X-API-KEY": MANCERKEY,
      "Content-Type": "application/json",
    },
  };
  let newbody = await convertJAIkotoMancer(request.body)
  try {
    const data = await postAsync(
      MANCERURL + "/v1/generate",
      JSON.stringify(newbody),
      config
    );
    console.log(data);
    var stop = Date.now();
    var diff = stop - start; // diff holds the milliseconds elapsed
    console.log(`time used for text generation: ${diff/1000} seconds`)
    return response_generate.send(data);
  } catch (error) {
    retval = { error: true, status: error.status, response: error.statusText };
    console.log(error);
    try {
      retval.response = await error.json();
      retval.response = retval.response.result;
    } catch {}
    return response_generate.send(retval);
  }
  
}

export { mancer_generate };
