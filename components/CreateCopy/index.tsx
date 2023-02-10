import { BodyGetOpenAiResult } from "@/pages/api/open-ai";
import {
  Button,
  FormControlLabel,
  FormGroup,
  Grid,
  Switch,
  TextField,
  Typography,
} from "@mui/material";
import { Box } from "@mui/system";
import LoadingButton from "@mui/lab/LoadingButton";
import { useMemo, useState } from "react";
import { FormattedMessage } from "react-intl";
import { useRouter } from "next/router";
import logo from "assets/AiChef.png";
import Image from "next/image";

const toneTypeButtonsEn = [
  { label: "Formal 👩‍💼", value: "Formal" },
  { label: "Informal 🙆‍♂️", value: "Informal" },
  { label: "Academic 🧑‍🎓", value: "Academic" },
  { label: "Playful 🤩", value: "Playful" },
  { label: "Serious 😐", value: "Serious" },
];

const toneTypeButtonsEs = [
  { label: "Formal 👩‍💼", value: "Formal" },
  { label: "Informal 🙆‍♂️", value: "Informal" },
  { label: "Academico 👩‍🏫", value: "Academico" },
  { label: "Alegre 🤩", value: "Alegre" },
  { label: "Serio 😐", value: "Serio" },
];

export enum LanguagesEnum {
  es = "es",
  en = "en",
}

const getPublicPlaceholder = (shortLocale: string): string => {
  switch (shortLocale) {
    case "es":
      return "Doctor, Gamer, Estudiante, Niño";
    case "en":
      return "Doctor, Gamer, Student, Kid";

    default:
      return "Doctor, Gamer, Student, Kid";
  }
};

const CreateCopy = () => {
  const { locale } = useRouter();
  const [shortLocale] = locale ? locale.split("-") : ["en"];
  const [toneTypeButtons, selectedLanguage] = useMemo(() => {
    switch (shortLocale) {
      case "es":
        return [toneTypeButtonsEs, LanguagesEnum.es];
      case "en":
        return [toneTypeButtonsEn, LanguagesEnum.en];
      default:
        return [toneTypeButtonsEn, LanguagesEnum.en];
    }
  }, [shortLocale]);

  const [loading, setLoading] = useState(false);

  const [toneType, setToneType] = useState(toneTypeButtons[0].value);
  const [copyToEdit, setCopyToEdit] = useState("");
  const [profession, setProfession] = useState("");

  const [result, setResult] = useState("");

  const fetchData = async (body: BodyGetOpenAiResult) => {
    const response = await fetch("/api/open-ai", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ ...body }),
    });

    if (!response.ok) {
      throw new Error(response.statusText);
    }

    const data = response.body;
    if (!data) {
      return;
    }
    const reader = data.getReader();
    const decoder = new TextDecoder();
    let done = false;

    while (!done) {
      const { value, done: doneReading } = await reader.read();
      done = doneReading;
      const chunkValue = decoder.decode(value);
      setResult((prev) => prev + chunkValue);
    }

    setLoading(false);
  };

  return (
    <Box
      sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}
    >
      <Box
        sx={{
          borderRadius: 4,
          p: 6,
          mx: 2,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          textAlign: "center",
          my: 4,
          maxWidth: "900px",
        }}
      >
        <Typography variant="h1" sx={{ mb: 2 }}>
          {" "}
          <FormattedMessage id="title" defaultMessage="Recipies AI" />
        </Typography>
        <Typography variant="h5" component="h2">
          <FormattedMessage
            id="subtitle"
            defaultMessage="Create you own recipies powered by AI"
          />
        </Typography>
        <Box
          sx={{
            mt: 5,
            display: "flex",
            flexDirection: "column",
            gap: 2,
            width: "100%",
            maxWidth: "600px",
            px: 2,
          }}
        >
          <Typography variant="h6" component="h3">
            <FormattedMessage id="toneType" />: {toneType}
          </Typography>
          <Grid
            direction="row"
            justifyContent="center"
            alignItems="center"
            spacing={2}
            container
          >
            {toneTypeButtons.map((button) => {
              return (
                <Grid key={button.value} item>
                  {toneType === button.value ? (
                    <Button
                      variant="contained"
                      onClick={() => setToneType(button.value)}
                    >
                      {button.label}
                    </Button>
                  ) : (
                    <Button
                      variant="outlined"
                      onClick={() => setToneType(button.value)}
                    >
                      {button.label}
                    </Button>
                  )}{" "}
                </Grid>
              );
            })}
          </Grid>
        </Box>
        <Box
          sx={{
            mt: 2,
            display: "flex",
            flexDirection: "column",
            gap: 2,
            width: "100%",
            p: 2,
          }}
        >
          <Typography variant="h5" component="h3">
            <FormattedMessage id="postDetails" />
          </Typography>
          <TextField
            id="outlined-basic"
            label={<FormattedMessage id="postProfession" />}
            onChange={(e) => setProfession(e.target.value)}
            placeholder={getPublicPlaceholder(shortLocale)}
            value={profession}
            variant="outlined"
            fullWidth
            InputLabelProps={{
              shrink: true,
            }}
          />
          <TextField
            sx={{ width: "100%", mt: 3 }}
            id="standard-multiline-static"
            label={<FormattedMessage id="postToEdit" />}
            value={copyToEdit}
            onChange={(e) => setCopyToEdit(e.target.value)}
            multiline
            rows={10}
            defaultValue="Default Value"
            variant="outlined"
            InputLabelProps={{
              shrink: true,
            }}
          />
        </Box>

        <LoadingButton
          sx={{ mt: 5 }}
          onClick={() =>
            fetchData({
              toneType,
              profession,
              copyToEdit,

              selectedLanguage,
            })
          }
          disabled={loading}
          loading={loading}
          size="large"
          fullWidth
          variant="contained"
        >
          <FormattedMessage id="generateCopy" />
        </LoadingButton>
        <TextField
          sx={{ width: "100%", mt: 3 }}
          id="standard-multiline-static"
          label="Result"
          value={result}
          multiline
          rows={10}
          defaultValue="Default Value"
          variant="outlined"
          InputLabelProps={{
            shrink: true,
          }}
        />
        <Button onClick={() => setResult("")}>
          <FormattedMessage id="erase" />
        </Button>
      </Box>
    </Box>
  );
};

export default CreateCopy;
