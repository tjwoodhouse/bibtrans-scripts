read test;
echo $test;

tts --text "$test" --model_name "tts_models/ind/fairseq/vits" --out_path $1
