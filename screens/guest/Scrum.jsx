import React from "react";
import { Surface, Text, useTheme } from "react-native-paper";
import {
  View,
  StyleSheet,
  KeyboardAvoidingView,
  ScrollView,
  Image,
} from "react-native";
import { supabase } from "../../service/auth";
import { useState } from "react";
import { Dropdown } from "react-native-element-dropdown";
import AntDesign from "@expo/vector-icons/AntDesign";

export default function ({ route }) {
  const { scrumId, playerHandle } = route.params;
  const theme = useTheme();
  const [choices, setChoices] = useState("");
  const [current, setCurrent] = useState("");
  const [value, setValue] = useState(null);
  const [isFocus, setIsFocus] = useState(false);

  function calcOptions(input) {
    return input?.split(",").map((i) => ({ label: i, value: i })) || [];
  }

  React.useEffect(() => {
    (async function () {
      console.log("SCRUM_ID", scrumId, "PLAYER_HANDLE", playerHandle);
      let { data: existing, error } = await supabase
        .from("tbl_scrum_player")
        .select("*")
        // Filters
        .eq("player_handle", playerHandle)
        .eq("scrum_id", scrumId);

      if (error) {
        alert(error.message);
      } else if (existing?.length > 0) {
        console.log(existing);
      } else {
        const { data: created, error } = await supabase
          .from("tbl_scrum_player")
          .insert([
            {
              player_handle: playerHandle,
              scrum_id: scrumId,
              player_joined: true,
            },
          ])
          .select();

        if (error) {
          alert(error.message);
        } else if (created?.length > 0) {
          console.log(created);
        }
      }
    })();
  }, []);

  React.useEffect(() => {
    (async function () {
      const subscribe = supabase
        .channel("tbl-scrummage-chan")
        .on(
          "postgres_changes",
          { event: "UPDATE", schema: "public", table: "tbl_scrummage" },
          (payload) => {
            const { current_item, scrum_choices } = payload["new"];
            setChoices(scrum_choices);
            setCurrent(current_item);
          },
        )
        .subscribe();

      console.log(subscribe);
    })();
  }, []);

  async function submitChoice(choice) {
    if (choice) {
      console.log(
        "choice",
        choice,
        "scrumId",
        scrumId,
        "playerHandle",
        playerHandle,
      );
      const { data, error } = await supabase
        .from("tbl_scrum_player")
        .update({ player_choice: choice })
        .eq("player_handle", playerHandle)
        .eq("scrum_id", scrumId)
        .select();

      if (error) {
        alert(error.message);
      } else {
        console.log(data);
      }
    }
  }

  return (
    <KeyboardAvoidingView behavior="height" enabled style={{ flex: 1 }}>
      <ScrollView
        contentContainerStyle={{
          flexGrow: 1,
        }}
      >
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Image
            resizeMode="contain"
            style={{
              height: 120,
              width: 300,
            }}
            source={require("../../assets/scrum-vote.png")}
          />
        </View>

        <View
          style={{
            flex: 5,
            paddingHorizontal: 20,
            paddingBottom: 20,
            backgroundColor: theme.light,
          }}
        >
          <Surface style={styles.surface} elevation={4}>
            <Text style={styles.currentTopic}>{current}</Text>
          </Surface>

          <Dropdown
            style={[styles.dropdown, isFocus && { borderColor: "blue" }]}
            placeholderStyle={styles.placeholderStyle}
            selectedTextStyle={styles.selectedTextStyle}
            inputSearchStyle={styles.inputSearchStyle}
            iconStyle={styles.iconStyle}
            data={calcOptions(choices)}
            search
            maxHeight={400}
            labelField="label"
            valueField="value"
            placeholder={!isFocus ? "Select item" : "..."}
            searchPlaceholder="Search..."
            value={value}
            onFocus={() => setIsFocus(true)}
            onBlur={() => setIsFocus(false)}
            onChange={(item) => {
              setValue(item.value);
              setIsFocus(false);
              submitChoice(item.value);
            }}
            renderLeftIcon={() => (
              <AntDesign
                style={styles.icon}
                color={isFocus ? "blue" : "black"}
                name="Safety"
                size={20}
              />
            )}
          />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  dropdown: {
    height: 50,
    borderColor: "gray",
    borderWidth: 0.5,
    borderRadius: 8,
    paddingHorizontal: 8,
  },
  icon: {
    marginRight: 5,
  },
  label: {
    position: "absolute",
    backgroundColor: "white",
    left: 22,
    top: 8,
    zIndex: 999,
    paddingHorizontal: 8,
    fontSize: 14,
  },
  placeholderStyle: {
    fontSize: 16,
  },
  selectedTextStyle: {
    fontSize: 16,
  },
  iconStyle: {
    width: 20,
    height: 20,
  },
  inputSearchStyle: {
    height: 40,
    fontSize: 16,
  },
  topicLabel: {
    textAlign: "center",
    paddingTop: 10,
    paddingBottom: 20,
  },
  surface: {
    padding: 5,
    marginBottom: 20,
  },
  currentTopic: {
    padding: 20,
    marginBottom: 20,
    fontSize: 18,
  },
});
