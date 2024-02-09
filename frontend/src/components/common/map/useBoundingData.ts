import { useCallback, useEffect, useMemo, useState } from "react";
import merge from "lodash.merge";
import axios from "axios";
import { estypes } from "@elastic/elasticsearch";
import { isEmpty } from "lodash";
import moment from "moment";

interface MapCoord {
  lng: number;
  lat: number;
}

export interface BoundingBox {
  _ne: MapCoord;
  _sw: MapCoord;
}
