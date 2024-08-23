"use client";
import { useState } from "react";
import {
  Input,
  Button,
  Card,
  Spacer,
  CardBody,
  CardHeader,
} from "@nextui-org/react";
import { useRouter } from "next/navigation";
import { useConfigurationStore } from "../utils/store";

export default function Home() {
  const [partitionName, setPartitionName] = useState("");
  const [baseURL, setBaseURL] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();
  const Configuration = useConfigurationStore((state) => state.configuration);
  const setConfiguration = useConfigurationStore(
    (state) => state.setConfiguration
  );

  if (Configuration !== undefined && Configuration !== null) {
    console.log(Configuration);
    router.push("/main");
  }
  const handleSubmit = () => {
    const configuration = {
      partitionName,
      baseURL,
      username,
      password,
    };
    //@ts-ignore
    setConfiguration(configuration);
    console.log(configuration);
    router.push("/main");
  };

  return (
    <div className="w-screen h-screen  bg-black flex justify-center items-center">
      <div className="flex flex-col items-center gap-4">
        <img src="/LAVENDEL-CONSULTING.png" className="mr-4 w-44 h-24" />
        <Card className="p-6 w-[400px]">
          <CardHeader>
            <h2 className="text-xl font-semibold">Configuration</h2>
          </CardHeader>
          <CardBody>
            <div className="flex flex-col gap-4">
              <Input
                isClearable
                label="Partition Name"
                value={partitionName}
                className="bg-white"
                onChange={(e) => setPartitionName(e.target.value)}
              />
              <Input
                isClearable
                label="Base URL"
                value={baseURL}
                onChange={(e) => setBaseURL(e.target.value)}
              />
              <Input
                isClearable
                label="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
              <Input
                isClearable
                label="Password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <Spacer y={1} />
              <Button onClick={handleSubmit} className="bg-blue-500 text-white">
                Submit
              </Button>
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}
