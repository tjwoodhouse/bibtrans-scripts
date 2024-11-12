A script to get a chapter from a Paratext Project and convert it to audio using Coqui TTS and fairseq models. 

This is useful for generating audio of back translations

# Installation

- See [Coqui TTS](https://github.com/coqui-ai/TTS) for instructions on installing Coqui and downloading the correct TTS model. You'll probably need a virtual environment to get this to work properly.

- Edit the `--model_name` value in `run_tss.sh` to use the model for your language.

- Run `chmod +x` for both scripts in this dir to make them executable.

- Add "export PTPROJ_PATH=<paratext project folder>" to your bash/zshrc/etc file.

# Usage

Call the `extract_pt_cpt.js <project> <book> <chapter>` and pie into `run_tts.sh <wav_file_path>`

Example: `./extract_pt_cpt.js MP1 GEN 1 | ./run_tts mp1_gen_1.wav`
