import type { LoaderArgs } from "@remix-run/node";
import { defer } from "@remix-run/node";
import { Await, Form, useNavigation, useSearchParams } from "@remix-run/react";
import { useLoaderData } from "@remix-run/react/dist/components";
import { Suspense } from "react";
import { getCarGenerallyDetails, getProcess } from "~/fake.service";

const CAR_NAV = ["GENERALLY", "PROCESS", "EDIT", "DAMAGE"] as const;

export async function loader({ params, request }: LoaderArgs) {
  const id = params.car_id;
  let data;

  const url = new URL(request.url);

  const param = url.searchParams.get("action");

  // GET REQUEST SEARCH PARAMS

  if (!param || param === "GENERALLY") {
    data = getCarGenerallyDetails();
  } else if (param && param === "PROCESS") {
    data = getProcess();
  }

  return defer({ id, data });
}

export default function Index() {
  const { id, data } = useLoaderData<typeof loader>();
  const [searchParams] = useSearchParams();
  const navigation = useNavigation();
  const ACTIVE_PARAMS = (navigation.formData?.get("action") ||
    searchParams.get("action")) as typeof CAR_NAV[number];

  const isLoading =
    navigation.location?.pathname === `/cars/${id}` &&
    (navigation.state === "submitting" || navigation.state === "loading");

  return (
    <div style={{ fontFamily: "system-ui, sans-serif", lineHeight: "1.4" }}>
      <h1>Welcome to Remix</h1>
      <Form method="get" name="action" action={`/cars/${id}`}>
        <button
          type="submit"
          name="action"
          value="GENERALLY"
          className={`${
            (ACTIVE_PARAMS === "GENERALLY" || !ACTIVE_PARAMS) && "bg-red-200"
          }`}
        >
          Allgemein
        </button>

        <button
          type="submit"
          name="action"
          value="PROCESS"
          className={`${ACTIVE_PARAMS === "PROCESS" && "bg-red-200"}`}
        >
          Vorgänge
        </button>

        <button
          type="submit"
          name="action"
          value="DAMAGE"
          className={`${ACTIVE_PARAMS === "DAMAGE" && "bg-red-200"}`}
        >
          Schäden
        </button>
      </Form>
      {/* GENERALLY */}
      {(!ACTIVE_PARAMS || ACTIVE_PARAMS === "GENERALLY") &&
        (isLoading ? (
          <p>Loading Generally...</p>
        ) : (
          <Suspense fallback={<p>Loading Generally...</p>}>
            <Await resolve={data} errorElement={<p>Error</p>}>
              {() => <p>Show GET GENERALLY</p>}
            </Await>
          </Suspense>
        ))}
      {/* PROCESS */}
      {ACTIVE_PARAMS &&
        ACTIVE_PARAMS === "PROCESS" &&
        (isLoading ? (
          <p>Loading Process...</p>
        ) : (
          <Suspense fallback={<p>Loading Process...</p>}>
            <Await resolve={data} errorElement={<p>Error</p>}>
              {() => <p>Show GET PROCESS</p>}
            </Await>
          </Suspense>
        ))}
    </div>
  );
}
