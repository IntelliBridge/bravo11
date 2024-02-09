export const data = {
  took: 38023,
  timed_out: false,
  _shards: {
    total: 1,
    successful: 1,
    skipped: 0,
    failed: 0,
  },
  hits: {
    total: {
      value: 10000,
      relation: "gte",
    },
    max_score: null,
    hits: [],
  },
  aggregations: {
    entities: {
      doc_count_error_upper_bound: 0,
      sum_other_doc_count: 11077334,
      buckets: [
        {
          key: "a01037",
          doc_count: 2765,
          assetTypes: {
            doc_count_error_upper_bound: 0,
            sum_other_doc_count: 0,
            buckets: [
              {
                key: "Aircraft",
                doc_count: 2765,
              },
            ],
          },
          sourceTypes: {
            doc_count_error_upper_bound: 0,
            sum_other_doc_count: 0,
            buckets: [
              {
                key: "ADSB",
                doc_count: 2765,
              },
            ],
          },
          timestamp: {
            buckets: [
              {
                key_as_string: "2024-01-01T00:00:00.000Z",
                key: 1704067200000,
                doc_count: 93,
                location: {
                  location: {
                    lat: 40.11256521492596,
                    lon: -122.24782860327151,
                  },
                  count: 93,
                },
              },
              {
                key_as_string: "2024-01-02T00:00:00.000Z",
                key: 1704153600000,
                doc_count: 93,
                location: {
                  location: {
                    lat: 40.11256521492596,
                    lon: -122.24782860327151,
                  },
                  count: 93,
                },
              },
              {
                key_as_string: "2024-01-03T00:00:00.000Z",
                key: 1704240000000,
                doc_count: 93,
                location: {
                  location: {
                    lat: 40.11256521492596,
                    lon: -122.24782860327151,
                  },
                  count: 93,
                },
              },
              {
                key_as_string: "2024-01-04T00:00:00.000Z",
                key: 1704326400000,
                doc_count: 93,
                location: {
                  location: {
                    lat: 40.11256521492596,
                    lon: -122.24782860327151,
                  },
                  count: 93,
                },
              },
              {
                key_as_string: "2024-01-05T00:00:00.000Z",
                key: 1704412800000,
                doc_count: 93,
                location: {
                  location: {
                    lat: 40.11256521492596,
                    lon: -122.24782860327151,
                  },
                  count: 93,
                },
              },
              {
                key_as_string: "2024-01-06T00:00:00.000Z",
                key: 1704499200000,
                doc_count: 93,
                location: {
                  location: {
                    lat: 40.11256521492596,
                    lon: -122.24782860327151,
                  },
                  count: 93,
                },
              },
              {
                key_as_string: "2024-01-07T00:00:00.000Z",
                key: 1704585600000,
                doc_count: 92,
                location: {
                  location: {
                    lat: 40.0719989074961,
                    lon: -122.24920914113602,
                  },
                  count: 92,
                },
              },
              {
                key_as_string: "2024-01-08T00:00:00.000Z",
                key: 1704672000000,
                doc_count: 92,
                location: {
                  location: {
                    lat: 40.0719989074961,
                    lon: -122.24920914113602,
                  },
                  count: 92,
                },
              },
              {
                key_as_string: "2024-01-09T00:00:00.000Z",
                key: 1704758400000,
                doc_count: 92,
                location: {
                  location: {
                    lat: 40.0719989074961,
                    lon: -122.24920914113602,
                  },
                  count: 92,
                },
              },
              {
                key_as_string: "2024-01-10T00:00:00.000Z",
                key: 1704844800000,
                doc_count: 92,
                location: {
                  location: {
                    lat: 40.0719989074961,
                    lon: -122.24920914113602,
                  },
                  count: 92,
                },
              },
              {
                key_as_string: "2024-01-11T00:00:00.000Z",
                key: 1704931200000,
                doc_count: 92,
                location: {
                  location: {
                    lat: 40.0719989074961,
                    lon: -122.24920914113602,
                  },
                  count: 92,
                },
              },
              {
                key_as_string: "2024-01-12T00:00:00.000Z",
                key: 1705017600000,
                doc_count: 92,
                location: {
                  location: {
                    lat: 40.0719989074961,
                    lon: -122.24920914113602,
                  },
                  count: 92,
                },
              },
              {
                key_as_string: "2024-01-13T00:00:00.000Z",
                key: 1705104000000,
                doc_count: 92,
                location: {
                  location: {
                    lat: 40.0719989074961,
                    lon: -122.24920914113602,
                  },
                  count: 92,
                },
              },
              {
                key_as_string: "2024-01-14T00:00:00.000Z",
                key: 1705190400000,
                doc_count: 92,
                location: {
                  location: {
                    lat: 40.0719989074961,
                    lon: -122.24920914113602,
                  },
                  count: 92,
                },
              },
              {
                key_as_string: "2024-01-15T00:00:00.000Z",
                key: 1705276800000,
                doc_count: 92,
                location: {
                  location: {
                    lat: 40.0719989074961,
                    lon: -122.24920914113602,
                  },
                  count: 92,
                },
              },
              {
                key_as_string: "2024-01-16T00:00:00.000Z",
                key: 1705363200000,
                doc_count: 92,
                location: {
                  location: {
                    lat: 40.0719989074961,
                    lon: -122.24920914113602,
                  },
                  count: 92,
                },
              },
              {
                key_as_string: "2024-01-17T00:00:00.000Z",
                key: 1705449600000,
                doc_count: 92,
                location: {
                  location: {
                    lat: 40.0719989074961,
                    lon: -122.24920914113602,
                  },
                  count: 92,
                },
              },
              {
                key_as_string: "2024-01-18T00:00:00.000Z",
                key: 1705536000000,
                doc_count: 92,
                location: {
                  location: {
                    lat: 40.0719989074961,
                    lon: -122.24920914113602,
                  },
                  count: 92,
                },
              },
              {
                key_as_string: "2024-01-19T00:00:00.000Z",
                key: 1705622400000,
                doc_count: 92,
                location: {
                  location: {
                    lat: 40.0719989074961,
                    lon: -122.24920914113602,
                  },
                  count: 92,
                },
              },
              {
                key_as_string: "2024-01-20T00:00:00.000Z",
                key: 1705708800000,
                doc_count: 92,
                location: {
                  location: {
                    lat: 40.0719989074961,
                    lon: -122.24920914113602,
                  },
                  count: 92,
                },
              },
              {
                key_as_string: "2024-01-21T00:00:00.000Z",
                key: 1705795200000,
                doc_count: 92,
                location: {
                  location: {
                    lat: 40.0719989074961,
                    lon: -122.24920914113602,
                  },
                  count: 92,
                },
              },
              {
                key_as_string: "2024-01-22T00:00:00.000Z",
                key: 1705881600000,
                doc_count: 92,
                location: {
                  location: {
                    lat: 40.0719989074961,
                    lon: -122.24920914113602,
                  },
                  count: 92,
                },
              },
              {
                key_as_string: "2024-01-23T00:00:00.000Z",
                key: 1705968000000,
                doc_count: 92,
                location: {
                  location: {
                    lat: 40.0719989074961,
                    lon: -122.24920914113602,
                  },
                  count: 92,
                },
              },
              {
                key_as_string: "2024-01-24T00:00:00.000Z",
                key: 1706054400000,
                doc_count: 92,
                location: {
                  location: {
                    lat: 40.0719989074961,
                    lon: -122.24920914113602,
                  },
                  count: 92,
                },
              },
              {
                key_as_string: "2024-01-25T00:00:00.000Z",
                key: 1706140800000,
                doc_count: 92,
                location: {
                  location: {
                    lat: 40.0719989074961,
                    lon: -122.24920914113602,
                  },
                  count: 92,
                },
              },
              {
                key_as_string: "2024-01-26T00:00:00.000Z",
                key: 1706227200000,
                doc_count: 92,
                location: {
                  location: {
                    lat: 40.0719989074961,
                    lon: -122.24920914113602,
                  },
                  count: 92,
                },
              },
              {
                key_as_string: "2024-01-27T00:00:00.000Z",
                key: 1706313600000,
                doc_count: 92,
                location: {
                  location: {
                    lat: 40.0719989074961,
                    lon: -122.24920914113602,
                  },
                  count: 92,
                },
              },
              {
                key_as_string: "2024-01-28T00:00:00.000Z",
                key: 1706400000000,
                doc_count: 92,
                location: {
                  location: {
                    lat: 40.0719989074961,
                    lon: -122.24920914113602,
                  },
                  count: 92,
                },
              },
              {
                key_as_string: "2024-01-29T00:00:00.000Z",
                key: 1706486400000,
                doc_count: 92,
                location: {
                  location: {
                    lat: 40.0719989074961,
                    lon: -122.24920914113602,
                  },
                  count: 92,
                },
              },
              {
                key_as_string: "2024-01-30T00:00:00.000Z",
                key: 1706572800000,
                doc_count: 91,
                location: {
                  location: {
                    lat: 40.14561711871935,
                    lon: -122.29507708870857,
                  },
                  count: 91,
                },
              },
            ],
          },
        },
        {
          key: "a2e110",
          doc_count: 2765,
          assetTypes: {
            doc_count_error_upper_bound: 0,
            sum_other_doc_count: 0,
            buckets: [
              {
                key: "Aircraft",
                doc_count: 2765,
              },
            ],
          },
          sourceTypes: {
            doc_count_error_upper_bound: 0,
            sum_other_doc_count: 0,
            buckets: [
              {
                key: "ADSB",
                doc_count: 2765,
              },
            ],
          },
          timestamp: {
            buckets: [
              {
                key_as_string: "2024-01-01T00:00:00.000Z",
                key: 1704067200000,
                doc_count: 93,
                location: {
                  location: {
                    lat: 37.719628496936735,
                    lon: -122.21608142488667,
                  },
                  count: 93,
                },
              },
              {
                key_as_string: "2024-01-02T00:00:00.000Z",
                key: 1704153600000,
                doc_count: 93,
                location: {
                  location: {
                    lat: 37.719628496936735,
                    lon: -122.21608142488667,
                  },
                  count: 93,
                },
              },
              {
                key_as_string: "2024-01-03T00:00:00.000Z",
                key: 1704240000000,
                doc_count: 93,
                location: {
                  location: {
                    lat: 37.719628496936735,
                    lon: -122.21608142488667,
                  },
                  count: 93,
                },
              },
              {
                key_as_string: "2024-01-04T00:00:00.000Z",
                key: 1704326400000,
                doc_count: 93,
                location: {
                  location: {
                    lat: 37.719628496936735,
                    lon: -122.21608142488667,
                  },
                  count: 93,
                },
              },
              {
                key_as_string: "2024-01-05T00:00:00.000Z",
                key: 1704412800000,
                doc_count: 93,
                location: {
                  location: {
                    lat: 37.719628496936735,
                    lon: -122.21608142488667,
                  },
                  count: 93,
                },
              },
              {
                key_as_string: "2024-01-06T00:00:00.000Z",
                key: 1704499200000,
                doc_count: 93,
                location: {
                  location: {
                    lat: 37.719628496936735,
                    lon: -122.21608142488667,
                  },
                  count: 93,
                },
              },
              {
                key_as_string: "2024-01-07T00:00:00.000Z",
                key: 1704585600000,
                doc_count: 92,
                location: {
                  location: {
                    lat: 37.71962855087148,
                    lon: -122.21608127690043,
                  },
                  count: 92,
                },
              },
              {
                key_as_string: "2024-01-08T00:00:00.000Z",
                key: 1704672000000,
                doc_count: 92,
                location: {
                  location: {
                    lat: 37.71962855087148,
                    lon: -122.21608127690043,
                  },
                  count: 92,
                },
              },
              {
                key_as_string: "2024-01-09T00:00:00.000Z",
                key: 1704758400000,
                doc_count: 92,
                location: {
                  location: {
                    lat: 37.71962855087148,
                    lon: -122.21608127690043,
                  },
                  count: 92,
                },
              },
              {
                key_as_string: "2024-01-10T00:00:00.000Z",
                key: 1704844800000,
                doc_count: 92,
                location: {
                  location: {
                    lat: 37.71962855087148,
                    lon: -122.21608127690043,
                  },
                  count: 92,
                },
              },
              {
                key_as_string: "2024-01-11T00:00:00.000Z",
                key: 1704931200000,
                doc_count: 92,
                location: {
                  location: {
                    lat: 37.71962855087148,
                    lon: -122.21608127690043,
                  },
                  count: 92,
                },
              },
              {
                key_as_string: "2024-01-12T00:00:00.000Z",
                key: 1705017600000,
                doc_count: 92,
                location: {
                  location: {
                    lat: 37.71962855087148,
                    lon: -122.21608127690043,
                  },
                  count: 92,
                },
              },
              {
                key_as_string: "2024-01-13T00:00:00.000Z",
                key: 1705104000000,
                doc_count: 92,
                location: {
                  location: {
                    lat: 37.71962855087148,
                    lon: -122.21608127690043,
                  },
                  count: 92,
                },
              },
              {
                key_as_string: "2024-01-14T00:00:00.000Z",
                key: 1705190400000,
                doc_count: 92,
                location: {
                  location: {
                    lat: 37.71962855087148,
                    lon: -122.21608127690043,
                  },
                  count: 92,
                },
              },
              {
                key_as_string: "2024-01-15T00:00:00.000Z",
                key: 1705276800000,
                doc_count: 92,
                location: {
                  location: {
                    lat: 37.71962855087148,
                    lon: -122.21608127690043,
                  },
                  count: 92,
                },
              },
              {
                key_as_string: "2024-01-16T00:00:00.000Z",
                key: 1705363200000,
                doc_count: 92,
                location: {
                  location: {
                    lat: 37.71962855087148,
                    lon: -122.21608127690043,
                  },
                  count: 92,
                },
              },
              {
                key_as_string: "2024-01-17T00:00:00.000Z",
                key: 1705449600000,
                doc_count: 92,
                location: {
                  location: {
                    lat: 37.71962855087148,
                    lon: -122.21608127690043,
                  },
                  count: 92,
                },
              },
              {
                key_as_string: "2024-01-18T00:00:00.000Z",
                key: 1705536000000,
                doc_count: 92,
                location: {
                  location: {
                    lat: 37.71962855087148,
                    lon: -122.21608127690043,
                  },
                  count: 92,
                },
              },
              {
                key_as_string: "2024-01-19T00:00:00.000Z",
                key: 1705622400000,
                doc_count: 92,
                location: {
                  location: {
                    lat: 37.71962855087148,
                    lon: -122.21608127690043,
                  },
                  count: 92,
                },
              },
              {
                key_as_string: "2024-01-20T00:00:00.000Z",
                key: 1705708800000,
                doc_count: 92,
                location: {
                  location: {
                    lat: 37.71962855087148,
                    lon: -122.21608127690043,
                  },
                  count: 92,
                },
              },
              {
                key_as_string: "2024-01-21T00:00:00.000Z",
                key: 1705795200000,
                doc_count: 92,
                location: {
                  location: {
                    lat: 37.71962855087148,
                    lon: -122.21608127690043,
                  },
                  count: 92,
                },
              },
              {
                key_as_string: "2024-01-22T00:00:00.000Z",
                key: 1705881600000,
                doc_count: 92,
                location: {
                  location: {
                    lat: 37.71962855087148,
                    lon: -122.21608127690043,
                  },
                  count: 92,
                },
              },
              {
                key_as_string: "2024-01-23T00:00:00.000Z",
                key: 1705968000000,
                doc_count: 92,
                location: {
                  location: {
                    lat: 37.71962855087148,
                    lon: -122.21608127690043,
                  },
                  count: 92,
                },
              },
              {
                key_as_string: "2024-01-24T00:00:00.000Z",
                key: 1706054400000,
                doc_count: 92,
                location: {
                  location: {
                    lat: 37.71962855087148,
                    lon: -122.21608127690043,
                  },
                  count: 92,
                },
              },
              {
                key_as_string: "2024-01-25T00:00:00.000Z",
                key: 1706140800000,
                doc_count: 92,
                location: {
                  location: {
                    lat: 37.71962855087148,
                    lon: -122.21608127690043,
                  },
                  count: 92,
                },
              },
              {
                key_as_string: "2024-01-26T00:00:00.000Z",
                key: 1706227200000,
                doc_count: 92,
                location: {
                  location: {
                    lat: 37.71962855087148,
                    lon: -122.21608127690043,
                  },
                  count: 92,
                },
              },
              {
                key_as_string: "2024-01-27T00:00:00.000Z",
                key: 1706313600000,
                doc_count: 92,
                location: {
                  location: {
                    lat: 37.71962855087148,
                    lon: -122.21608127690043,
                  },
                  count: 92,
                },
              },
              {
                key_as_string: "2024-01-28T00:00:00.000Z",
                key: 1706400000000,
                doc_count: 92,
                location: {
                  location: {
                    lat: 37.71962855087148,
                    lon: -122.21608127690043,
                  },
                  count: 92,
                },
              },
              {
                key_as_string: "2024-01-29T00:00:00.000Z",
                key: 1706486400000,
                doc_count: 92,
                location: {
                  location: {
                    lat: 37.71962855087148,
                    lon: -122.21608127690043,
                  },
                  count: 92,
                },
              },
              {
                key_as_string: "2024-01-30T00:00:00.000Z",
                key: 1706572800000,
                doc_count: 91,
                location: {
                  location: {
                    lat: 37.7196286059916,
                    lon: -122.2160812932998,
                  },
                  count: 91,
                },
              },
            ],
          },
        },
        {
          key: "ac10d8",
          doc_count: 2765,
          assetTypes: {
            doc_count_error_upper_bound: 0,
            sum_other_doc_count: 0,
            buckets: [
              {
                key: "Aircraft",
                doc_count: 2765,
              },
            ],
          },
          sourceTypes: {
            doc_count_error_upper_bound: 0,
            sum_other_doc_count: 0,
            buckets: [
              {
                key: "ADSB",
                doc_count: 2765,
              },
            ],
          },
          timestamp: {
            buckets: [
              {
                key_as_string: "2024-01-01T00:00:00.000Z",
                key: 1704067200000,
                doc_count: 93,
                location: {
                  location: {
                    lat: 37.71660039246443,
                    lon: -122.22140063020971,
                  },
                  count: 93,
                },
              },
              {
                key_as_string: "2024-01-02T00:00:00.000Z",
                key: 1704153600000,
                doc_count: 93,
                location: {
                  location: {
                    lat: 37.71660039246443,
                    lon: -122.22140063020971,
                  },
                  count: 93,
                },
              },
              {
                key_as_string: "2024-01-03T00:00:00.000Z",
                key: 1704240000000,
                doc_count: 93,
                location: {
                  location: {
                    lat: 37.71660039246443,
                    lon: -122.22140063020971,
                  },
                  count: 93,
                },
              },
              {
                key_as_string: "2024-01-04T00:00:00.000Z",
                key: 1704326400000,
                doc_count: 93,
                location: {
                  location: {
                    lat: 37.71660039246443,
                    lon: -122.22140063020971,
                  },
                  count: 93,
                },
              },
              {
                key_as_string: "2024-01-05T00:00:00.000Z",
                key: 1704412800000,
                doc_count: 93,
                location: {
                  location: {
                    lat: 37.71660039246443,
                    lon: -122.22140063020971,
                  },
                  count: 93,
                },
              },
              {
                key_as_string: "2024-01-06T00:00:00.000Z",
                key: 1704499200000,
                doc_count: 93,
                location: {
                  location: {
                    lat: 37.71660039246443,
                    lon: -122.22140063020971,
                  },
                  count: 93,
                },
              },
              {
                key_as_string: "2024-01-07T00:00:00.000Z",
                key: 1704585600000,
                doc_count: 92,
                location: {
                  location: {
                    lat: 37.716600412968546,
                    lon: -122.2214005820696,
                  },
                  count: 92,
                },
              },
              {
                key_as_string: "2024-01-08T00:00:00.000Z",
                key: 1704672000000,
                doc_count: 92,
                location: {
                  location: {
                    lat: 37.716600412968546,
                    lon: -122.2214005820696,
                  },
                  count: 92,
                },
              },
              {
                key_as_string: "2024-01-09T00:00:00.000Z",
                key: 1704758400000,
                doc_count: 92,
                location: {
                  location: {
                    lat: 37.716600412968546,
                    lon: -122.2214005820696,
                  },
                  count: 92,
                },
              },
              {
                key_as_string: "2024-01-10T00:00:00.000Z",
                key: 1704844800000,
                doc_count: 92,
                location: {
                  location: {
                    lat: 37.716600412968546,
                    lon: -122.2214005820696,
                  },
                  count: 92,
                },
              },
              {
                key_as_string: "2024-01-11T00:00:00.000Z",
                key: 1704931200000,
                doc_count: 92,
                location: {
                  location: {
                    lat: 37.716600412968546,
                    lon: -122.2214005820696,
                  },
                  count: 92,
                },
              },
              {
                key_as_string: "2024-01-12T00:00:00.000Z",
                key: 1705017600000,
                doc_count: 92,
                location: {
                  location: {
                    lat: 37.716600412968546,
                    lon: -122.2214005820696,
                  },
                  count: 92,
                },
              },
              {
                key_as_string: "2024-01-13T00:00:00.000Z",
                key: 1705104000000,
                doc_count: 92,
                location: {
                  location: {
                    lat: 37.716600412968546,
                    lon: -122.2214005820696,
                  },
                  count: 92,
                },
              },
              {
                key_as_string: "2024-01-14T00:00:00.000Z",
                key: 1705190400000,
                doc_count: 92,
                location: {
                  location: {
                    lat: 37.716600412968546,
                    lon: -122.2214005820696,
                  },
                  count: 92,
                },
              },
              {
                key_as_string: "2024-01-15T00:00:00.000Z",
                key: 1705276800000,
                doc_count: 92,
                location: {
                  location: {
                    lat: 37.716600412968546,
                    lon: -122.2214005820696,
                  },
                  count: 92,
                },
              },
              {
                key_as_string: "2024-01-16T00:00:00.000Z",
                key: 1705363200000,
                doc_count: 92,
                location: {
                  location: {
                    lat: 37.716600412968546,
                    lon: -122.2214005820696,
                  },
                  count: 92,
                },
              },
              {
                key_as_string: "2024-01-17T00:00:00.000Z",
                key: 1705449600000,
                doc_count: 92,
                location: {
                  location: {
                    lat: 37.716600412968546,
                    lon: -122.2214005820696,
                  },
                  count: 92,
                },
              },
              {
                key_as_string: "2024-01-18T00:00:00.000Z",
                key: 1705536000000,
                doc_count: 92,
                location: {
                  location: {
                    lat: 37.716600412968546,
                    lon: -122.2214005820696,
                  },
                  count: 92,
                },
              },
              {
                key_as_string: "2024-01-19T00:00:00.000Z",
                key: 1705622400000,
                doc_count: 92,
                location: {
                  location: {
                    lat: 37.716600412968546,
                    lon: -122.2214005820696,
                  },
                  count: 92,
                },
              },
              {
                key_as_string: "2024-01-20T00:00:00.000Z",
                key: 1705708800000,
                doc_count: 92,
                location: {
                  location: {
                    lat: 37.716600412968546,
                    lon: -122.2214005820696,
                  },
                  count: 92,
                },
              },
              {
                key_as_string: "2024-01-21T00:00:00.000Z",
                key: 1705795200000,
                doc_count: 92,
                location: {
                  location: {
                    lat: 37.716600412968546,
                    lon: -122.2214005820696,
                  },
                  count: 92,
                },
              },
              {
                key_as_string: "2024-01-22T00:00:00.000Z",
                key: 1705881600000,
                doc_count: 92,
                location: {
                  location: {
                    lat: 37.716600412968546,
                    lon: -122.2214005820696,
                  },
                  count: 92,
                },
              },
              {
                key_as_string: "2024-01-23T00:00:00.000Z",
                key: 1705968000000,
                doc_count: 92,
                location: {
                  location: {
                    lat: 37.716600412968546,
                    lon: -122.2214005820696,
                  },
                  count: 92,
                },
              },
              {
                key_as_string: "2024-01-24T00:00:00.000Z",
                key: 1706054400000,
                doc_count: 92,
                location: {
                  location: {
                    lat: 37.716600412968546,
                    lon: -122.2214005820696,
                  },
                  count: 92,
                },
              },
              {
                key_as_string: "2024-01-25T00:00:00.000Z",
                key: 1706140800000,
                doc_count: 92,
                location: {
                  location: {
                    lat: 37.716600412968546,
                    lon: -122.2214005820696,
                  },
                  count: 92,
                },
              },
              {
                key_as_string: "2024-01-26T00:00:00.000Z",
                key: 1706227200000,
                doc_count: 92,
                location: {
                  location: {
                    lat: 37.716600412968546,
                    lon: -122.2214005820696,
                  },
                  count: 92,
                },
              },
              {
                key_as_string: "2024-01-27T00:00:00.000Z",
                key: 1706313600000,
                doc_count: 92,
                location: {
                  location: {
                    lat: 37.716600412968546,
                    lon: -122.2214005820696,
                  },
                  count: 92,
                },
              },
              {
                key_as_string: "2024-01-28T00:00:00.000Z",
                key: 1706400000000,
                doc_count: 92,
                location: {
                  location: {
                    lat: 37.716600412968546,
                    lon: -122.2214005820696,
                  },
                  count: 92,
                },
              },
              {
                key_as_string: "2024-01-29T00:00:00.000Z",
                key: 1706486400000,
                doc_count: 92,
                location: {
                  location: {
                    lat: 37.716600412968546,
                    lon: -122.2214005820696,
                  },
                  count: 92,
                },
              },
              {
                key_as_string: "2024-01-30T00:00:00.000Z",
                key: 1706572800000,
                doc_count: 91,
                location: {
                  location: {
                    lat: 37.71660039201379,
                    lon: -122.22140061669052,
                  },
                  count: 91,
                },
              },
            ],
          },
        },
        {
          key: "10fa02",
          doc_count: 2764,
          assetTypes: {
            doc_count_error_upper_bound: 0,
            sum_other_doc_count: 0,
            buckets: [
              {
                key: "Aircraft",
                doc_count: 2764,
              },
            ],
          },
          sourceTypes: {
            doc_count_error_upper_bound: 0,
            sum_other_doc_count: 0,
            buckets: [
              {
                key: "ADSB",
                doc_count: 2764,
              },
            ],
          },
          timestamp: {
            buckets: [
              {
                key_as_string: "2024-01-01T00:00:00.000Z",
                key: 1704067200000,
                doc_count: 93,
                location: {
                  location: {
                    lat: 51.71727951736219,
                    lon: 46.182704646921444,
                  },
                  count: 93,
                },
              },
              {
                key_as_string: "2024-01-02T00:00:00.000Z",
                key: 1704153600000,
                doc_count: 93,
                location: {
                  location: {
                    lat: 51.71727951736219,
                    lon: 46.182704646921444,
                  },
                  count: 93,
                },
              },
              {
                key_as_string: "2024-01-03T00:00:00.000Z",
                key: 1704240000000,
                doc_count: 93,
                location: {
                  location: {
                    lat: 51.71727951736219,
                    lon: 46.182704646921444,
                  },
                  count: 93,
                },
              },
              {
                key_as_string: "2024-01-04T00:00:00.000Z",
                key: 1704326400000,
                doc_count: 93,
                location: {
                  location: {
                    lat: 51.71727951736219,
                    lon: 46.182704646921444,
                  },
                  count: 93,
                },
              },
              {
                key_as_string: "2024-01-05T00:00:00.000Z",
                key: 1704412800000,
                doc_count: 93,
                location: {
                  location: {
                    lat: 51.71727951736219,
                    lon: 46.182704646921444,
                  },
                  count: 93,
                },
              },
              {
                key_as_string: "2024-01-06T00:00:00.000Z",
                key: 1704499200000,
                doc_count: 92,
                location: {
                  location: {
                    lat: 51.71727949753404,
                    lon: 46.182704686146714,
                  },
                  count: 92,
                },
              },
              {
                key_as_string: "2024-01-07T00:00:00.000Z",
                key: 1704585600000,
                doc_count: 92,
                location: {
                  location: {
                    lat: 51.71727949753404,
                    lon: 46.182704686146714,
                  },
                  count: 92,
                },
              },
              {
                key_as_string: "2024-01-08T00:00:00.000Z",
                key: 1704672000000,
                doc_count: 92,
                location: {
                  location: {
                    lat: 51.71727949753404,
                    lon: 46.182704686146714,
                  },
                  count: 92,
                },
              },
              {
                key_as_string: "2024-01-09T00:00:00.000Z",
                key: 1704758400000,
                doc_count: 92,
                location: {
                  location: {
                    lat: 51.71727949753404,
                    lon: 46.182704686146714,
                  },
                  count: 92,
                },
              },
              {
                key_as_string: "2024-01-10T00:00:00.000Z",
                key: 1704844800000,
                doc_count: 92,
                location: {
                  location: {
                    lat: 51.71727949753404,
                    lon: 46.182704686146714,
                  },
                  count: 92,
                },
              },
              {
                key_as_string: "2024-01-11T00:00:00.000Z",
                key: 1704931200000,
                doc_count: 92,
                location: {
                  location: {
                    lat: 51.71727949753404,
                    lon: 46.182704686146714,
                  },
                  count: 92,
                },
              },
              {
                key_as_string: "2024-01-12T00:00:00.000Z",
                key: 1705017600000,
                doc_count: 92,
                location: {
                  location: {
                    lat: 51.71727949753404,
                    lon: 46.182704686146714,
                  },
                  count: 92,
                },
              },
              {
                key_as_string: "2024-01-13T00:00:00.000Z",
                key: 1705104000000,
                doc_count: 92,
                location: {
                  location: {
                    lat: 51.71727949753404,
                    lon: 46.182704686146714,
                  },
                  count: 92,
                },
              },
              {
                key_as_string: "2024-01-14T00:00:00.000Z",
                key: 1705190400000,
                doc_count: 92,
                location: {
                  location: {
                    lat: 51.71727949753404,
                    lon: 46.182704686146714,
                  },
                  count: 92,
                },
              },
              {
                key_as_string: "2024-01-15T00:00:00.000Z",
                key: 1705276800000,
                doc_count: 92,
                location: {
                  location: {
                    lat: 51.71727949753404,
                    lon: 46.182704686146714,
                  },
                  count: 92,
                },
              },
              {
                key_as_string: "2024-01-16T00:00:00.000Z",
                key: 1705363200000,
                doc_count: 92,
                location: {
                  location: {
                    lat: 51.71727949753404,
                    lon: 46.182704686146714,
                  },
                  count: 92,
                },
              },
              {
                key_as_string: "2024-01-17T00:00:00.000Z",
                key: 1705449600000,
                doc_count: 92,
                location: {
                  location: {
                    lat: 51.71727949753404,
                    lon: 46.182704686146714,
                  },
                  count: 92,
                },
              },
              {
                key_as_string: "2024-01-18T00:00:00.000Z",
                key: 1705536000000,
                doc_count: 92,
                location: {
                  location: {
                    lat: 51.71727949753404,
                    lon: 46.182704686146714,
                  },
                  count: 92,
                },
              },
              {
                key_as_string: "2024-01-19T00:00:00.000Z",
                key: 1705622400000,
                doc_count: 92,
                location: {
                  location: {
                    lat: 51.71727949753404,
                    lon: 46.182704686146714,
                  },
                  count: 92,
                },
              },
              {
                key_as_string: "2024-01-20T00:00:00.000Z",
                key: 1705708800000,
                doc_count: 92,
                location: {
                  location: {
                    lat: 51.71727949753404,
                    lon: 46.182704686146714,
                  },
                  count: 92,
                },
              },
              {
                key_as_string: "2024-01-21T00:00:00.000Z",
                key: 1705795200000,
                doc_count: 92,
                location: {
                  location: {
                    lat: 51.71727949753404,
                    lon: 46.182704686146714,
                  },
                  count: 92,
                },
              },
              {
                key_as_string: "2024-01-22T00:00:00.000Z",
                key: 1705881600000,
                doc_count: 92,
                location: {
                  location: {
                    lat: 51.71727949753404,
                    lon: 46.182704686146714,
                  },
                  count: 92,
                },
              },
              {
                key_as_string: "2024-01-23T00:00:00.000Z",
                key: 1705968000000,
                doc_count: 92,
                location: {
                  location: {
                    lat: 51.71727949753404,
                    lon: 46.182704686146714,
                  },
                  count: 92,
                },
              },
              {
                key_as_string: "2024-01-24T00:00:00.000Z",
                key: 1706054400000,
                doc_count: 92,
                location: {
                  location: {
                    lat: 51.71727949753404,
                    lon: 46.182704686146714,
                  },
                  count: 92,
                },
              },
              {
                key_as_string: "2024-01-25T00:00:00.000Z",
                key: 1706140800000,
                doc_count: 92,
                location: {
                  location: {
                    lat: 51.71727949753404,
                    lon: 46.182704686146714,
                  },
                  count: 92,
                },
              },
              {
                key_as_string: "2024-01-26T00:00:00.000Z",
                key: 1706227200000,
                doc_count: 92,
                location: {
                  location: {
                    lat: 51.71727949753404,
                    lon: 46.182704686146714,
                  },
                  count: 92,
                },
              },
              {
                key_as_string: "2024-01-27T00:00:00.000Z",
                key: 1706313600000,
                doc_count: 92,
                location: {
                  location: {
                    lat: 51.71727949753404,
                    lon: 46.182704686146714,
                  },
                  count: 92,
                },
              },
              {
                key_as_string: "2024-01-28T00:00:00.000Z",
                key: 1706400000000,
                doc_count: 92,
                location: {
                  location: {
                    lat: 51.71727949753404,
                    lon: 46.182704686146714,
                  },
                  count: 92,
                },
              },
              {
                key_as_string: "2024-01-29T00:00:00.000Z",
                key: 1706486400000,
                doc_count: 92,
                location: {
                  location: {
                    lat: 51.71727949753404,
                    lon: 46.182704686146714,
                  },
                  count: 92,
                },
              },
              {
                key_as_string: "2024-01-30T00:00:00.000Z",
                key: 1706572800000,
                doc_count: 91,
                location: {
                  location: {
                    lat: 51.71727951964016,
                    lon: 46.18270464241505,
                  },
                  count: 91,
                },
              },
            ],
          },
        },
        {
          key: "31ffca",
          doc_count: 2764,
          assetTypes: {
            doc_count_error_upper_bound: 0,
            sum_other_doc_count: 0,
            buckets: [
              {
                key: "Aircraft",
                doc_count: 2764,
              },
            ],
          },
          sourceTypes: {
            doc_count_error_upper_bound: 0,
            sum_other_doc_count: 0,
            buckets: [
              {
                key: "ADSB",
                doc_count: 2764,
              },
            ],
          },
          timestamp: {
            buckets: [
              {
                key_as_string: "2024-01-01T00:00:00.000Z",
                key: 1704067200000,
                doc_count: 93,
                location: {
                  location: {
                    lat: 45.197711668217615,
                    lon: 7.645739285095084,
                  },
                  count: 93,
                },
              },
              {
                key_as_string: "2024-01-02T00:00:00.000Z",
                key: 1704153600000,
                doc_count: 93,
                location: {
                  location: {
                    lat: 45.197711668217615,
                    lon: 7.645739285095084,
                  },
                  count: 93,
                },
              },
              {
                key_as_string: "2024-01-03T00:00:00.000Z",
                key: 1704240000000,
                doc_count: 93,
                location: {
                  location: {
                    lat: 45.197711668217615,
                    lon: 7.645739285095084,
                  },
                  count: 93,
                },
              },
              {
                key_as_string: "2024-01-04T00:00:00.000Z",
                key: 1704326400000,
                doc_count: 93,
                location: {
                  location: {
                    lat: 45.197711668217615,
                    lon: 7.645739285095084,
                  },
                  count: 93,
                },
              },
              {
                key_as_string: "2024-01-05T00:00:00.000Z",
                key: 1704412800000,
                doc_count: 93,
                location: {
                  location: {
                    lat: 45.197711668217615,
                    lon: 7.645739285095084,
                  },
                  count: 93,
                },
              },
              {
                key_as_string: "2024-01-06T00:00:00.000Z",
                key: 1704499200000,
                doc_count: 92,
                location: {
                  location: {
                    lat: 45.19771145828797,
                    lon: 7.6457388320451845,
                  },
                  count: 92,
                },
              },
              {
                key_as_string: "2024-01-07T00:00:00.000Z",
                key: 1704585600000,
                doc_count: 92,
                location: {
                  location: {
                    lat: 45.19771145828797,
                    lon: 7.6457388320451845,
                  },
                  count: 92,
                },
              },
              {
                key_as_string: "2024-01-08T00:00:00.000Z",
                key: 1704672000000,
                doc_count: 92,
                location: {
                  location: {
                    lat: 45.19771145828797,
                    lon: 7.6457388320451845,
                  },
                  count: 92,
                },
              },
              {
                key_as_string: "2024-01-09T00:00:00.000Z",
                key: 1704758400000,
                doc_count: 92,
                location: {
                  location: {
                    lat: 45.19771145828797,
                    lon: 7.6457388320451845,
                  },
                  count: 92,
                },
              },
              {
                key_as_string: "2024-01-10T00:00:00.000Z",
                key: 1704844800000,
                doc_count: 92,
                location: {
                  location: {
                    lat: 45.19771145828797,
                    lon: 7.6457388320451845,
                  },
                  count: 92,
                },
              },
              {
                key_as_string: "2024-01-11T00:00:00.000Z",
                key: 1704931200000,
                doc_count: 92,
                location: {
                  location: {
                    lat: 45.19771145828797,
                    lon: 7.6457388320451845,
                  },
                  count: 92,
                },
              },
              {
                key_as_string: "2024-01-12T00:00:00.000Z",
                key: 1705017600000,
                doc_count: 92,
                location: {
                  location: {
                    lat: 45.19771145828797,
                    lon: 7.6457388320451845,
                  },
                  count: 92,
                },
              },
              {
                key_as_string: "2024-01-13T00:00:00.000Z",
                key: 1705104000000,
                doc_count: 92,
                location: {
                  location: {
                    lat: 45.19771145828797,
                    lon: 7.6457388320451845,
                  },
                  count: 92,
                },
              },
              {
                key_as_string: "2024-01-14T00:00:00.000Z",
                key: 1705190400000,
                doc_count: 92,
                location: {
                  location: {
                    lat: 45.19771145828797,
                    lon: 7.6457388320451845,
                  },
                  count: 92,
                },
              },
              {
                key_as_string: "2024-01-15T00:00:00.000Z",
                key: 1705276800000,
                doc_count: 92,
                location: {
                  location: {
                    lat: 45.19771145828797,
                    lon: 7.6457388320451845,
                  },
                  count: 92,
                },
              },
              {
                key_as_string: "2024-01-16T00:00:00.000Z",
                key: 1705363200000,
                doc_count: 92,
                location: {
                  location: {
                    lat: 45.19771145828797,
                    lon: 7.6457388320451845,
                  },
                  count: 92,
                },
              },
              {
                key_as_string: "2024-01-17T00:00:00.000Z",
                key: 1705449600000,
                doc_count: 92,
                location: {
                  location: {
                    lat: 45.19771145828797,
                    lon: 7.6457388320451845,
                  },
                  count: 92,
                },
              },
              {
                key_as_string: "2024-01-18T00:00:00.000Z",
                key: 1705536000000,
                doc_count: 92,
                location: {
                  location: {
                    lat: 45.19771145828797,
                    lon: 7.6457388320451845,
                  },
                  count: 92,
                },
              },
              {
                key_as_string: "2024-01-19T00:00:00.000Z",
                key: 1705622400000,
                doc_count: 92,
                location: {
                  location: {
                    lat: 45.19771145828797,
                    lon: 7.6457388320451845,
                  },
                  count: 92,
                },
              },
              {
                key_as_string: "2024-01-20T00:00:00.000Z",
                key: 1705708800000,
                doc_count: 92,
                location: {
                  location: {
                    lat: 45.19771145828797,
                    lon: 7.6457388320451845,
                  },
                  count: 92,
                },
              },
              {
                key_as_string: "2024-01-21T00:00:00.000Z",
                key: 1705795200000,
                doc_count: 92,
                location: {
                  location: {
                    lat: 45.19771145828797,
                    lon: 7.6457388320451845,
                  },
                  count: 92,
                },
              },
              {
                key_as_string: "2024-01-22T00:00:00.000Z",
                key: 1705881600000,
                doc_count: 92,
                location: {
                  location: {
                    lat: 45.19771145828797,
                    lon: 7.6457388320451845,
                  },
                  count: 92,
                },
              },
              {
                key_as_string: "2024-01-23T00:00:00.000Z",
                key: 1705968000000,
                doc_count: 92,
                location: {
                  location: {
                    lat: 45.19771145828797,
                    lon: 7.6457388320451845,
                  },
                  count: 92,
                },
              },
              {
                key_as_string: "2024-01-24T00:00:00.000Z",
                key: 1706054400000,
                doc_count: 92,
                location: {
                  location: {
                    lat: 45.19771145828797,
                    lon: 7.6457388320451845,
                  },
                  count: 92,
                },
              },
              {
                key_as_string: "2024-01-25T00:00:00.000Z",
                key: 1706140800000,
                doc_count: 92,
                location: {
                  location: {
                    lat: 45.19771145828797,
                    lon: 7.6457388320451845,
                  },
                  count: 92,
                },
              },
              {
                key_as_string: "2024-01-26T00:00:00.000Z",
                key: 1706227200000,
                doc_count: 92,
                location: {
                  location: {
                    lat: 45.19771145828797,
                    lon: 7.6457388320451845,
                  },
                  count: 92,
                },
              },
              {
                key_as_string: "2024-01-27T00:00:00.000Z",
                key: 1706313600000,
                doc_count: 92,
                location: {
                  location: {
                    lat: 45.19771145828797,
                    lon: 7.6457388320451845,
                  },
                  count: 92,
                },
              },
              {
                key_as_string: "2024-01-28T00:00:00.000Z",
                key: 1706400000000,
                doc_count: 92,
                location: {
                  location: {
                    lat: 45.19771145828797,
                    lon: 7.6457388320451845,
                  },
                  count: 92,
                },
              },
              {
                key_as_string: "2024-01-29T00:00:00.000Z",
                key: 1706486400000,
                doc_count: 92,
                location: {
                  location: {
                    lat: 45.19771145828797,
                    lon: 7.6457388320451845,
                  },
                  count: 92,
                },
              },
              {
                key_as_string: "2024-01-30T00:00:00.000Z",
                key: 1706572800000,
                doc_count: 91,
                location: {
                  location: {
                    lat: 45.19771162093013,
                    lon: 7.64573908103937,
                  },
                  count: 91,
                },
              },
            ],
          },
        },
        {
          key: "456003",
          doc_count: 2764,
          assetTypes: {
            doc_count_error_upper_bound: 0,
            sum_other_doc_count: 0,
            buckets: [
              {
                key: "Aircraft",
                doc_count: 2764,
              },
            ],
          },
          sourceTypes: {
            doc_count_error_upper_bound: 0,
            sum_other_doc_count: 0,
            buckets: [
              {
                key: "ADSB",
                doc_count: 2764,
              },
            ],
          },
          timestamp: {
            buckets: [
              {
                key_as_string: "2024-01-01T00:00:00.000Z",
                key: 1704067200000,
                doc_count: 93,
                location: {
                  location: {
                    lat: 42.70016944937168,
                    lon: 23.407680920715773,
                  },
                  count: 93,
                },
              },
              {
                key_as_string: "2024-01-02T00:00:00.000Z",
                key: 1704153600000,
                doc_count: 93,
                location: {
                  location: {
                    lat: 42.70016944937168,
                    lon: 23.407680920715773,
                  },
                  count: 93,
                },
              },
              {
                key_as_string: "2024-01-03T00:00:00.000Z",
                key: 1704240000000,
                doc_count: 93,
                location: {
                  location: {
                    lat: 42.70016944937168,
                    lon: 23.407680920715773,
                  },
                  count: 93,
                },
              },
              {
                key_as_string: "2024-01-04T00:00:00.000Z",
                key: 1704326400000,
                doc_count: 93,
                location: {
                  location: {
                    lat: 42.70016944937168,
                    lon: 23.407680920715773,
                  },
                  count: 93,
                },
              },
              {
                key_as_string: "2024-01-05T00:00:00.000Z",
                key: 1704412800000,
                doc_count: 93,
                location: {
                  location: {
                    lat: 42.70016944937168,
                    lon: 23.407680920715773,
                  },
                  count: 93,
                },
              },
              {
                key_as_string: "2024-01-06T00:00:00.000Z",
                key: 1704499200000,
                doc_count: 92,
                location: {
                  location: {
                    lat: 42.700169458732255,
                    lon: 23.407680925447494,
                  },
                  count: 92,
                },
              },
              {
                key_as_string: "2024-01-07T00:00:00.000Z",
                key: 1704585600000,
                doc_count: 92,
                location: {
                  location: {
                    lat: 42.700169458732255,
                    lon: 23.407680925447494,
                  },
                  count: 92,
                },
              },
              {
                key_as_string: "2024-01-08T00:00:00.000Z",
                key: 1704672000000,
                doc_count: 92,
                location: {
                  location: {
                    lat: 42.700169458732255,
                    lon: 23.407680925447494,
                  },
                  count: 92,
                },
              },
              {
                key_as_string: "2024-01-09T00:00:00.000Z",
                key: 1704758400000,
                doc_count: 92,
                location: {
                  location: {
                    lat: 42.700169458732255,
                    lon: 23.407680925447494,
                  },
                  count: 92,
                },
              },
              {
                key_as_string: "2024-01-10T00:00:00.000Z",
                key: 1704844800000,
                doc_count: 92,
                location: {
                  location: {
                    lat: 42.700169458732255,
                    lon: 23.407680925447494,
                  },
                  count: 92,
                },
              },
              {
                key_as_string: "2024-01-11T00:00:00.000Z",
                key: 1704931200000,
                doc_count: 92,
                location: {
                  location: {
                    lat: 42.700169458732255,
                    lon: 23.407680925447494,
                  },
                  count: 92,
                },
              },
              {
                key_as_string: "2024-01-12T00:00:00.000Z",
                key: 1705017600000,
                doc_count: 92,
                location: {
                  location: {
                    lat: 42.700169458732255,
                    lon: 23.407680925447494,
                  },
                  count: 92,
                },
              },
              {
                key_as_string: "2024-01-13T00:00:00.000Z",
                key: 1705104000000,
                doc_count: 92,
                location: {
                  location: {
                    lat: 42.700169458732255,
                    lon: 23.407680925447494,
                  },
                  count: 92,
                },
              },
              {
                key_as_string: "2024-01-14T00:00:00.000Z",
                key: 1705190400000,
                doc_count: 92,
                location: {
                  location: {
                    lat: 42.700169458732255,
                    lon: 23.407680925447494,
                  },
                  count: 92,
                },
              },
              {
                key_as_string: "2024-01-15T00:00:00.000Z",
                key: 1705276800000,
                doc_count: 92,
                location: {
                  location: {
                    lat: 42.700169458732255,
                    lon: 23.407680925447494,
                  },
                  count: 92,
                },
              },
              {
                key_as_string: "2024-01-16T00:00:00.000Z",
                key: 1705363200000,
                doc_count: 92,
                location: {
                  location: {
                    lat: 42.700169458732255,
                    lon: 23.407680925447494,
                  },
                  count: 92,
                },
              },
              {
                key_as_string: "2024-01-17T00:00:00.000Z",
                key: 1705449600000,
                doc_count: 92,
                location: {
                  location: {
                    lat: 42.700169458732255,
                    lon: 23.407680925447494,
                  },
                  count: 92,
                },
              },
              {
                key_as_string: "2024-01-18T00:00:00.000Z",
                key: 1705536000000,
                doc_count: 92,
                location: {
                  location: {
                    lat: 42.700169458732255,
                    lon: 23.407680925447494,
                  },
                  count: 92,
                },
              },
              {
                key_as_string: "2024-01-19T00:00:00.000Z",
                key: 1705622400000,
                doc_count: 92,
                location: {
                  location: {
                    lat: 42.700169458732255,
                    lon: 23.407680925447494,
                  },
                  count: 92,
                },
              },
              {
                key_as_string: "2024-01-20T00:00:00.000Z",
                key: 1705708800000,
                doc_count: 92,
                location: {
                  location: {
                    lat: 42.700169458732255,
                    lon: 23.407680925447494,
                  },
                  count: 92,
                },
              },
              {
                key_as_string: "2024-01-21T00:00:00.000Z",
                key: 1705795200000,
                doc_count: 92,
                location: {
                  location: {
                    lat: 42.700169458732255,
                    lon: 23.407680925447494,
                  },
                  count: 92,
                },
              },
              {
                key_as_string: "2024-01-22T00:00:00.000Z",
                key: 1705881600000,
                doc_count: 92,
                location: {
                  location: {
                    lat: 42.700169458732255,
                    lon: 23.407680925447494,
                  },
                  count: 92,
                },
              },
              {
                key_as_string: "2024-01-23T00:00:00.000Z",
                key: 1705968000000,
                doc_count: 92,
                location: {
                  location: {
                    lat: 42.700169458732255,
                    lon: 23.407680925447494,
                  },
                  count: 92,
                },
              },
              {
                key_as_string: "2024-01-24T00:00:00.000Z",
                key: 1706054400000,
                doc_count: 92,
                location: {
                  location: {
                    lat: 42.700169458732255,
                    lon: 23.407680925447494,
                  },
                  count: 92,
                },
              },
              {
                key_as_string: "2024-01-25T00:00:00.000Z",
                key: 1706140800000,
                doc_count: 92,
                location: {
                  location: {
                    lat: 42.700169458732255,
                    lon: 23.407680925447494,
                  },
                  count: 92,
                },
              },
              {
                key_as_string: "2024-01-26T00:00:00.000Z",
                key: 1706227200000,
                doc_count: 92,
                location: {
                  location: {
                    lat: 42.700169458732255,
                    lon: 23.407680925447494,
                  },
                  count: 92,
                },
              },
              {
                key_as_string: "2024-01-27T00:00:00.000Z",
                key: 1706313600000,
                doc_count: 92,
                location: {
                  location: {
                    lat: 42.700169458732255,
                    lon: 23.407680925447494,
                  },
                  count: 92,
                },
              },
              {
                key_as_string: "2024-01-28T00:00:00.000Z",
                key: 1706400000000,
                doc_count: 92,
                location: {
                  location: {
                    lat: 42.700169458732255,
                    lon: 23.407680925447494,
                  },
                  count: 92,
                },
              },
              {
                key_as_string: "2024-01-29T00:00:00.000Z",
                key: 1706486400000,
                doc_count: 92,
                location: {
                  location: {
                    lat: 42.700169458732255,
                    lon: 23.407680925447494,
                  },
                  count: 92,
                },
              },
              {
                key_as_string: "2024-01-30T00:00:00.000Z",
                key: 1706572800000,
                doc_count: 91,
                location: {
                  location: {
                    lat: 42.700169468298554,
                    lon: 23.407680930283206,
                  },
                  count: 91,
                },
              },
            ],
          },
        },
        {
          key: "456021",
          doc_count: 2764,
          assetTypes: {
            doc_count_error_upper_bound: 0,
            sum_other_doc_count: 0,
            buckets: [
              {
                key: "Aircraft",
                doc_count: 2764,
              },
            ],
          },
          sourceTypes: {
            doc_count_error_upper_bound: 0,
            sum_other_doc_count: 0,
            buckets: [
              {
                key: "ADSB",
                doc_count: 2764,
              },
            ],
          },
          timestamp: {
            buckets: [
              {
                key_as_string: "2024-01-01T00:00:00.000Z",
                key: 1704067200000,
                doc_count: 93,
                location: {
                  location: {
                    lat: 42.68489080766636,
                    lon: 23.409455658928042,
                  },
                  count: 93,
                },
              },
              {
                key_as_string: "2024-01-02T00:00:00.000Z",
                key: 1704153600000,
                doc_count: 93,
                location: {
                  location: {
                    lat: 42.68489080766636,
                    lon: 23.409455658928042,
                  },
                  count: 93,
                },
              },
              {
                key_as_string: "2024-01-03T00:00:00.000Z",
                key: 1704240000000,
                doc_count: 93,
                location: {
                  location: {
                    lat: 42.68489080766636,
                    lon: 23.409455658928042,
                  },
                  count: 93,
                },
              },
              {
                key_as_string: "2024-01-04T00:00:00.000Z",
                key: 1704326400000,
                doc_count: 93,
                location: {
                  location: {
                    lat: 42.68489080766636,
                    lon: 23.409455658928042,
                  },
                  count: 93,
                },
              },
              {
                key_as_string: "2024-01-05T00:00:00.000Z",
                key: 1704412800000,
                doc_count: 93,
                location: {
                  location: {
                    lat: 42.68489080766636,
                    lon: 23.409455658928042,
                  },
                  count: 93,
                },
              },
              {
                key_as_string: "2024-01-06T00:00:00.000Z",
                key: 1704499200000,
                doc_count: 92,
                location: {
                  location: {
                    lat: 42.68489097437376,
                    lon: 23.409455674093056,
                  },
                  count: 92,
                },
              },
              {
                key_as_string: "2024-01-07T00:00:00.000Z",
                key: 1704585600000,
                doc_count: 92,
                location: {
                  location: {
                    lat: 42.68489097437376,
                    lon: 23.409455674093056,
                  },
                  count: 92,
                },
              },
              {
                key_as_string: "2024-01-08T00:00:00.000Z",
                key: 1704672000000,
                doc_count: 92,
                location: {
                  location: {
                    lat: 42.68489097437376,
                    lon: 23.409455674093056,
                  },
                  count: 92,
                },
              },
              {
                key_as_string: "2024-01-09T00:00:00.000Z",
                key: 1704758400000,
                doc_count: 92,
                location: {
                  location: {
                    lat: 42.68489097437376,
                    lon: 23.409455674093056,
                  },
                  count: 92,
                },
              },
              {
                key_as_string: "2024-01-10T00:00:00.000Z",
                key: 1704844800000,
                doc_count: 92,
                location: {
                  location: {
                    lat: 42.68489097437376,
                    lon: 23.409455674093056,
                  },
                  count: 92,
                },
              },
              {
                key_as_string: "2024-01-11T00:00:00.000Z",
                key: 1704931200000,
                doc_count: 92,
                location: {
                  location: {
                    lat: 42.68489097437376,
                    lon: 23.409455674093056,
                  },
                  count: 92,
                },
              },
              {
                key_as_string: "2024-01-12T00:00:00.000Z",
                key: 1705017600000,
                doc_count: 92,
                location: {
                  location: {
                    lat: 42.68489097437376,
                    lon: 23.409455674093056,
                  },
                  count: 92,
                },
              },
              {
                key_as_string: "2024-01-13T00:00:00.000Z",
                key: 1705104000000,
                doc_count: 92,
                location: {
                  location: {
                    lat: 42.68489097437376,
                    lon: 23.409455674093056,
                  },
                  count: 92,
                },
              },
              {
                key_as_string: "2024-01-14T00:00:00.000Z",
                key: 1705190400000,
                doc_count: 92,
                location: {
                  location: {
                    lat: 42.68489097437376,
                    lon: 23.409455674093056,
                  },
                  count: 92,
                },
              },
              {
                key_as_string: "2024-01-15T00:00:00.000Z",
                key: 1705276800000,
                doc_count: 92,
                location: {
                  location: {
                    lat: 42.68489097437376,
                    lon: 23.409455674093056,
                  },
                  count: 92,
                },
              },
              {
                key_as_string: "2024-01-16T00:00:00.000Z",
                key: 1705363200000,
                doc_count: 92,
                location: {
                  location: {
                    lat: 42.68489097437376,
                    lon: 23.409455674093056,
                  },
                  count: 92,
                },
              },
              {
                key_as_string: "2024-01-17T00:00:00.000Z",
                key: 1705449600000,
                doc_count: 92,
                location: {
                  location: {
                    lat: 42.68489097437376,
                    lon: 23.409455674093056,
                  },
                  count: 92,
                },
              },
              {
                key_as_string: "2024-01-18T00:00:00.000Z",
                key: 1705536000000,
                doc_count: 92,
                location: {
                  location: {
                    lat: 42.68489097437376,
                    lon: 23.409455674093056,
                  },
                  count: 92,
                },
              },
              {
                key_as_string: "2024-01-19T00:00:00.000Z",
                key: 1705622400000,
                doc_count: 92,
                location: {
                  location: {
                    lat: 42.68489097437376,
                    lon: 23.409455674093056,
                  },
                  count: 92,
                },
              },
              {
                key_as_string: "2024-01-20T00:00:00.000Z",
                key: 1705708800000,
                doc_count: 92,
                location: {
                  location: {
                    lat: 42.68489097437376,
                    lon: 23.409455674093056,
                  },
                  count: 92,
                },
              },
              {
                key_as_string: "2024-01-21T00:00:00.000Z",
                key: 1705795200000,
                doc_count: 92,
                location: {
                  location: {
                    lat: 42.68489097437376,
                    lon: 23.409455674093056,
                  },
                  count: 92,
                },
              },
              {
                key_as_string: "2024-01-22T00:00:00.000Z",
                key: 1705881600000,
                doc_count: 92,
                location: {
                  location: {
                    lat: 42.68489097437376,
                    lon: 23.409455674093056,
                  },
                  count: 92,
                },
              },
              {
                key_as_string: "2024-01-23T00:00:00.000Z",
                key: 1705968000000,
                doc_count: 92,
                location: {
                  location: {
                    lat: 42.68489097437376,
                    lon: 23.409455674093056,
                  },
                  count: 92,
                },
              },
              {
                key_as_string: "2024-01-24T00:00:00.000Z",
                key: 1706054400000,
                doc_count: 92,
                location: {
                  location: {
                    lat: 42.68489097437376,
                    lon: 23.409455674093056,
                  },
                  count: 92,
                },
              },
              {
                key_as_string: "2024-01-25T00:00:00.000Z",
                key: 1706140800000,
                doc_count: 92,
                location: {
                  location: {
                    lat: 42.68489097437376,
                    lon: 23.409455674093056,
                  },
                  count: 92,
                },
              },
              {
                key_as_string: "2024-01-26T00:00:00.000Z",
                key: 1706227200000,
                doc_count: 92,
                location: {
                  location: {
                    lat: 42.68489097437376,
                    lon: 23.409455674093056,
                  },
                  count: 92,
                },
              },
              {
                key_as_string: "2024-01-27T00:00:00.000Z",
                key: 1706313600000,
                doc_count: 92,
                location: {
                  location: {
                    lat: 42.68489097437376,
                    lon: 23.409455674093056,
                  },
                  count: 92,
                },
              },
              {
                key_as_string: "2024-01-28T00:00:00.000Z",
                key: 1706400000000,
                doc_count: 92,
                location: {
                  location: {
                    lat: 42.68489097437376,
                    lon: 23.409455674093056,
                  },
                  count: 92,
                },
              },
              {
                key_as_string: "2024-01-29T00:00:00.000Z",
                key: 1706486400000,
                doc_count: 92,
                location: {
                  location: {
                    lat: 42.68489097437376,
                    lon: 23.409455674093056,
                  },
                  count: 92,
                },
              },
              {
                key_as_string: "2024-01-30T00:00:00.000Z",
                key: 1706572800000,
                doc_count: 91,
                location: {
                  location: {
                    lat: 42.68489068374038,
                    lon: 23.409456276324587,
                  },
                  count: 91,
                },
              },
            ],
          },
        },
        {
          key: "45fe46",
          doc_count: 2764,
          assetTypes: {
            doc_count_error_upper_bound: 0,
            sum_other_doc_count: 0,
            buckets: [
              {
                key: "Aircraft",
                doc_count: 2764,
              },
            ],
          },
          sourceTypes: {
            doc_count_error_upper_bound: 0,
            sum_other_doc_count: 0,
            buckets: [
              {
                key: "ADSB",
                doc_count: 2764,
              },
            ],
          },
          timestamp: {
            buckets: [
              {
                key_as_string: "2024-01-01T00:00:00.000Z",
                key: 1704067200000,
                doc_count: 93,
                location: {
                  location: {
                    lat: 55.749305878886055,
                    lon: 9.146032455948092,
                  },
                  count: 93,
                },
              },
              {
                key_as_string: "2024-01-02T00:00:00.000Z",
                key: 1704153600000,
                doc_count: 93,
                location: {
                  location: {
                    lat: 55.749305878886055,
                    lon: 9.146032455948092,
                  },
                  count: 93,
                },
              },
              {
                key_as_string: "2024-01-03T00:00:00.000Z",
                key: 1704240000000,
                doc_count: 93,
                location: {
                  location: {
                    lat: 55.749305878886055,
                    lon: 9.146032455948092,
                  },
                  count: 93,
                },
              },
              {
                key_as_string: "2024-01-04T00:00:00.000Z",
                key: 1704326400000,
                doc_count: 93,
                location: {
                  location: {
                    lat: 55.749305878886055,
                    lon: 9.146032455948092,
                  },
                  count: 93,
                },
              },
              {
                key_as_string: "2024-01-05T00:00:00.000Z",
                key: 1704412800000,
                doc_count: 93,
                location: {
                  location: {
                    lat: 55.749305878886055,
                    lon: 9.146032455948092,
                  },
                  count: 93,
                },
              },
              {
                key_as_string: "2024-01-06T00:00:00.000Z",
                key: 1704499200000,
                doc_count: 92,
                location: {
                  location: {
                    lat: 55.74930588066902,
                    lon: 9.146032457280418,
                  },
                  count: 92,
                },
              },
              {
                key_as_string: "2024-01-07T00:00:00.000Z",
                key: 1704585600000,
                doc_count: 92,
                location: {
                  location: {
                    lat: 55.74930588066902,
                    lon: 9.146032457280418,
                  },
                  count: 92,
                },
              },
              {
                key_as_string: "2024-01-08T00:00:00.000Z",
                key: 1704672000000,
                doc_count: 92,
                location: {
                  location: {
                    lat: 55.74930588066902,
                    lon: 9.146032457280418,
                  },
                  count: 92,
                },
              },
              {
                key_as_string: "2024-01-09T00:00:00.000Z",
                key: 1704758400000,
                doc_count: 92,
                location: {
                  location: {
                    lat: 55.74930588066902,
                    lon: 9.146032457280418,
                  },
                  count: 92,
                },
              },
              {
                key_as_string: "2024-01-10T00:00:00.000Z",
                key: 1704844800000,
                doc_count: 92,
                location: {
                  location: {
                    lat: 55.74930588066902,
                    lon: 9.146032457280418,
                  },
                  count: 92,
                },
              },
              {
                key_as_string: "2024-01-11T00:00:00.000Z",
                key: 1704931200000,
                doc_count: 92,
                location: {
                  location: {
                    lat: 55.74930588066902,
                    lon: 9.146032457280418,
                  },
                  count: 92,
                },
              },
              {
                key_as_string: "2024-01-12T00:00:00.000Z",
                key: 1705017600000,
                doc_count: 92,
                location: {
                  location: {
                    lat: 55.74930588066902,
                    lon: 9.146032457280418,
                  },
                  count: 92,
                },
              },
              {
                key_as_string: "2024-01-13T00:00:00.000Z",
                key: 1705104000000,
                doc_count: 92,
                location: {
                  location: {
                    lat: 55.74930588066902,
                    lon: 9.146032457280418,
                  },
                  count: 92,
                },
              },
              {
                key_as_string: "2024-01-14T00:00:00.000Z",
                key: 1705190400000,
                doc_count: 92,
                location: {
                  location: {
                    lat: 55.74930588066902,
                    lon: 9.146032457280418,
                  },
                  count: 92,
                },
              },
              {
                key_as_string: "2024-01-15T00:00:00.000Z",
                key: 1705276800000,
                doc_count: 92,
                location: {
                  location: {
                    lat: 55.74930588066902,
                    lon: 9.146032457280418,
                  },
                  count: 92,
                },
              },
              {
                key_as_string: "2024-01-16T00:00:00.000Z",
                key: 1705363200000,
                doc_count: 92,
                location: {
                  location: {
                    lat: 55.74930588066902,
                    lon: 9.146032457280418,
                  },
                  count: 92,
                },
              },
              {
                key_as_string: "2024-01-17T00:00:00.000Z",
                key: 1705449600000,
                doc_count: 92,
                location: {
                  location: {
                    lat: 55.74930588066902,
                    lon: 9.146032457280418,
                  },
                  count: 92,
                },
              },
              {
                key_as_string: "2024-01-18T00:00:00.000Z",
                key: 1705536000000,
                doc_count: 92,
                location: {
                  location: {
                    lat: 55.74930588066902,
                    lon: 9.146032457280418,
                  },
                  count: 92,
                },
              },
              {
                key_as_string: "2024-01-19T00:00:00.000Z",
                key: 1705622400000,
                doc_count: 92,
                location: {
                  location: {
                    lat: 55.74930588066902,
                    lon: 9.146032457280418,
                  },
                  count: 92,
                },
              },
              {
                key_as_string: "2024-01-20T00:00:00.000Z",
                key: 1705708800000,
                doc_count: 92,
                location: {
                  location: {
                    lat: 55.74930588066902,
                    lon: 9.146032457280418,
                  },
                  count: 92,
                },
              },
              {
                key_as_string: "2024-01-21T00:00:00.000Z",
                key: 1705795200000,
                doc_count: 92,
                location: {
                  location: {
                    lat: 55.74930588066902,
                    lon: 9.146032457280418,
                  },
                  count: 92,
                },
              },
              {
                key_as_string: "2024-01-22T00:00:00.000Z",
                key: 1705881600000,
                doc_count: 92,
                location: {
                  location: {
                    lat: 55.74930588066902,
                    lon: 9.146032457280418,
                  },
                  count: 92,
                },
              },
              {
                key_as_string: "2024-01-23T00:00:00.000Z",
                key: 1705968000000,
                doc_count: 92,
                location: {
                  location: {
                    lat: 55.74930588066902,
                    lon: 9.146032457280418,
                  },
                  count: 92,
                },
              },
              {
                key_as_string: "2024-01-24T00:00:00.000Z",
                key: 1706054400000,
                doc_count: 92,
                location: {
                  location: {
                    lat: 55.74930588066902,
                    lon: 9.146032457280418,
                  },
                  count: 92,
                },
              },
              {
                key_as_string: "2024-01-25T00:00:00.000Z",
                key: 1706140800000,
                doc_count: 92,
                location: {
                  location: {
                    lat: 55.74930588066902,
                    lon: 9.146032457280418,
                  },
                  count: 92,
                },
              },
              {
                key_as_string: "2024-01-26T00:00:00.000Z",
                key: 1706227200000,
                doc_count: 92,
                location: {
                  location: {
                    lat: 55.74930588066902,
                    lon: 9.146032457280418,
                  },
                  count: 92,
                },
              },
              {
                key_as_string: "2024-01-27T00:00:00.000Z",
                key: 1706313600000,
                doc_count: 92,
                location: {
                  location: {
                    lat: 55.74930588066902,
                    lon: 9.146032457280418,
                  },
                  count: 92,
                },
              },
              {
                key_as_string: "2024-01-28T00:00:00.000Z",
                key: 1706400000000,
                doc_count: 92,
                location: {
                  location: {
                    lat: 55.74930588066902,
                    lon: 9.146032457280418,
                  },
                  count: 92,
                },
              },
              {
                key_as_string: "2024-01-29T00:00:00.000Z",
                key: 1706486400000,
                doc_count: 92,
                location: {
                  location: {
                    lat: 55.74930588066902,
                    lon: 9.146032457280418,
                  },
                  count: 92,
                },
              },
              {
                key_as_string: "2024-01-30T00:00:00.000Z",
                key: 1706572800000,
                doc_count: 91,
                location: {
                  location: {
                    lat: 55.74930588249117,
                    lon: 9.146032458642027,
                  },
                  count: 91,
                },
              },
            ],
          },
        },
        {
          key: "45fe49",
          doc_count: 2764,
          assetTypes: {
            doc_count_error_upper_bound: 0,
            sum_other_doc_count: 0,
            buckets: [
              {
                key: "Aircraft",
                doc_count: 2764,
              },
            ],
          },
          sourceTypes: {
            doc_count_error_upper_bound: 0,
            sum_other_doc_count: 0,
            buckets: [
              {
                key: "ADSB",
                doc_count: 2764,
              },
            ],
          },
          timestamp: {
            buckets: [
              {
                key_as_string: "2024-01-01T00:00:00.000Z",
                key: 1704067200000,
                doc_count: 93,
                location: {
                  location: {
                    lat: 55.591325125687064,
                    lon: 12.128488130927567,
                  },
                  count: 93,
                },
              },
              {
                key_as_string: "2024-01-02T00:00:00.000Z",
                key: 1704153600000,
                doc_count: 93,
                location: {
                  location: {
                    lat: 55.591325125687064,
                    lon: 12.128488130927567,
                  },
                  count: 93,
                },
              },
              {
                key_as_string: "2024-01-03T00:00:00.000Z",
                key: 1704240000000,
                doc_count: 92,
                location: {
                  location: {
                    lat: 55.591325057042845,
                    lon: 12.12848825086637,
                  },
                  count: 92,
                },
              },
              {
                key_as_string: "2024-01-04T00:00:00.000Z",
                key: 1704326400000,
                doc_count: 93,
                location: {
                  location: {
                    lat: 55.591325125687064,
                    lon: 12.128488130927567,
                  },
                  count: 93,
                },
              },
              {
                key_as_string: "2024-01-05T00:00:00.000Z",
                key: 1704412800000,
                doc_count: 93,
                location: {
                  location: {
                    lat: 55.591325125687064,
                    lon: 12.128488130927567,
                  },
                  count: 93,
                },
              },
              {
                key_as_string: "2024-01-06T00:00:00.000Z",
                key: 1704499200000,
                doc_count: 93,
                location: {
                  location: {
                    lat: 55.591325125687064,
                    lon: 12.128488130927567,
                  },
                  count: 93,
                },
              },
              {
                key_as_string: "2024-01-07T00:00:00.000Z",
                key: 1704585600000,
                doc_count: 92,
                location: {
                  location: {
                    lat: 55.591325057042845,
                    lon: 12.12848825086637,
                  },
                  count: 92,
                },
              },
              {
                key_as_string: "2024-01-08T00:00:00.000Z",
                key: 1704672000000,
                doc_count: 92,
                location: {
                  location: {
                    lat: 55.591325057042845,
                    lon: 12.12848825086637,
                  },
                  count: 92,
                },
              },
              {
                key_as_string: "2024-01-09T00:00:00.000Z",
                key: 1704758400000,
                doc_count: 92,
                location: {
                  location: {
                    lat: 55.591325057042845,
                    lon: 12.12848825086637,
                  },
                  count: 92,
                },
              },
              {
                key_as_string: "2024-01-10T00:00:00.000Z",
                key: 1704844800000,
                doc_count: 92,
                location: {
                  location: {
                    lat: 55.591325057042845,
                    lon: 12.12848825086637,
                  },
                  count: 92,
                },
              },
              {
                key_as_string: "2024-01-11T00:00:00.000Z",
                key: 1704931200000,
                doc_count: 92,
                location: {
                  location: {
                    lat: 55.591325057042845,
                    lon: 12.12848825086637,
                  },
                  count: 92,
                },
              },
              {
                key_as_string: "2024-01-12T00:00:00.000Z",
                key: 1705017600000,
                doc_count: 92,
                location: {
                  location: {
                    lat: 55.591325057042845,
                    lon: 12.12848825086637,
                  },
                  count: 92,
                },
              },
              {
                key_as_string: "2024-01-13T00:00:00.000Z",
                key: 1705104000000,
                doc_count: 92,
                location: {
                  location: {
                    lat: 55.591325057042845,
                    lon: 12.12848825086637,
                  },
                  count: 92,
                },
              },
              {
                key_as_string: "2024-01-14T00:00:00.000Z",
                key: 1705190400000,
                doc_count: 92,
                location: {
                  location: {
                    lat: 55.591325057042845,
                    lon: 12.12848825086637,
                  },
                  count: 92,
                },
              },
              {
                key_as_string: "2024-01-15T00:00:00.000Z",
                key: 1705276800000,
                doc_count: 92,
                location: {
                  location: {
                    lat: 55.591325057042845,
                    lon: 12.12848825086637,
                  },
                  count: 92,
                },
              },
              {
                key_as_string: "2024-01-16T00:00:00.000Z",
                key: 1705363200000,
                doc_count: 92,
                location: {
                  location: {
                    lat: 55.591325057042845,
                    lon: 12.12848825086637,
                  },
                  count: 92,
                },
              },
              {
                key_as_string: "2024-01-17T00:00:00.000Z",
                key: 1705449600000,
                doc_count: 92,
                location: {
                  location: {
                    lat: 55.591325057042845,
                    lon: 12.12848825086637,
                  },
                  count: 92,
                },
              },
              {
                key_as_string: "2024-01-18T00:00:00.000Z",
                key: 1705536000000,
                doc_count: 92,
                location: {
                  location: {
                    lat: 55.591325057042845,
                    lon: 12.12848825086637,
                  },
                  count: 92,
                },
              },
              {
                key_as_string: "2024-01-19T00:00:00.000Z",
                key: 1705622400000,
                doc_count: 92,
                location: {
                  location: {
                    lat: 55.591325057042845,
                    lon: 12.12848825086637,
                  },
                  count: 92,
                },
              },
              {
                key_as_string: "2024-01-20T00:00:00.000Z",
                key: 1705708800000,
                doc_count: 92,
                location: {
                  location: {
                    lat: 55.591325057042845,
                    lon: 12.12848825086637,
                  },
                  count: 92,
                },
              },
              {
                key_as_string: "2024-01-21T00:00:00.000Z",
                key: 1705795200000,
                doc_count: 92,
                location: {
                  location: {
                    lat: 55.591325057042845,
                    lon: 12.12848825086637,
                  },
                  count: 92,
                },
              },
              {
                key_as_string: "2024-01-22T00:00:00.000Z",
                key: 1705881600000,
                doc_count: 92,
                location: {
                  location: {
                    lat: 55.591325057042845,
                    lon: 12.12848825086637,
                  },
                  count: 92,
                },
              },
              {
                key_as_string: "2024-01-23T00:00:00.000Z",
                key: 1705968000000,
                doc_count: 92,
                location: {
                  location: {
                    lat: 55.591325057042845,
                    lon: 12.12848825086637,
                  },
                  count: 92,
                },
              },
              {
                key_as_string: "2024-01-24T00:00:00.000Z",
                key: 1706054400000,
                doc_count: 92,
                location: {
                  location: {
                    lat: 55.591325057042845,
                    lon: 12.12848825086637,
                  },
                  count: 92,
                },
              },
              {
                key_as_string: "2024-01-25T00:00:00.000Z",
                key: 1706140800000,
                doc_count: 92,
                location: {
                  location: {
                    lat: 55.591325057042845,
                    lon: 12.12848825086637,
                  },
                  count: 92,
                },
              },
              {
                key_as_string: "2024-01-26T00:00:00.000Z",
                key: 1706227200000,
                doc_count: 92,
                location: {
                  location: {
                    lat: 55.591325057042845,
                    lon: 12.12848825086637,
                  },
                  count: 92,
                },
              },
              {
                key_as_string: "2024-01-27T00:00:00.000Z",
                key: 1706313600000,
                doc_count: 92,
                location: {
                  location: {
                    lat: 55.591325057042845,
                    lon: 12.12848825086637,
                  },
                  count: 92,
                },
              },
              {
                key_as_string: "2024-01-28T00:00:00.000Z",
                key: 1706400000000,
                doc_count: 92,
                location: {
                  location: {
                    lat: 55.591325057042845,
                    lon: 12.12848825086637,
                  },
                  count: 92,
                },
              },
              {
                key_as_string: "2024-01-29T00:00:00.000Z",
                key: 1706486400000,
                doc_count: 92,
                location: {
                  location: {
                    lat: 55.591325057042845,
                    lon: 12.12848825086637,
                  },
                  count: 92,
                },
              },
              {
                key_as_string: "2024-01-30T00:00:00.000Z",
                key: 1706572800000,
                doc_count: 91,
                location: {
                  location: {
                    lat: 55.59132498688996,
                    lon: 12.128488373441192,
                  },
                  count: 91,
                },
              },
            ],
          },
        },
        {
          key: "45fe53",
          doc_count: 2764,
          assetTypes: {
            doc_count_error_upper_bound: 0,
            sum_other_doc_count: 0,
            buckets: [
              {
                key: "Aircraft",
                doc_count: 2764,
              },
            ],
          },
          sourceTypes: {
            doc_count_error_upper_bound: 0,
            sum_other_doc_count: 0,
            buckets: [
              {
                key: "ADSB",
                doc_count: 2764,
              },
            ],
          },
          timestamp: {
            buckets: [
              {
                key_as_string: "2024-01-01T00:00:00.000Z",
                key: 1704067200000,
                doc_count: 93,
                location: {
                  location: {
                    lat: 55.09526061359793,
                    lon: 8.543951008468866,
                  },
                  count: 93,
                },
              },
              {
                key_as_string: "2024-01-02T00:00:00.000Z",
                key: 1704153600000,
                doc_count: 93,
                location: {
                  location: {
                    lat: 55.09526061359793,
                    lon: 8.543951008468866,
                  },
                  count: 93,
                },
              },
              {
                key_as_string: "2024-01-03T00:00:00.000Z",
                key: 1704240000000,
                doc_count: 92,
                location: {
                  location: {
                    lat: 55.09526061359793,
                    lon: 8.543951008468866,
                  },
                  count: 92,
                },
              },
              {
                key_as_string: "2024-01-04T00:00:00.000Z",
                key: 1704326400000,
                doc_count: 93,
                location: {
                  location: {
                    lat: 55.09526061359793,
                    lon: 8.543951008468866,
                  },
                  count: 93,
                },
              },
              {
                key_as_string: "2024-01-05T00:00:00.000Z",
                key: 1704412800000,
                doc_count: 93,
                location: {
                  location: {
                    lat: 55.09526061359793,
                    lon: 8.543951008468866,
                  },
                  count: 93,
                },
              },
              {
                key_as_string: "2024-01-06T00:00:00.000Z",
                key: 1704499200000,
                doc_count: 93,
                location: {
                  location: {
                    lat: 55.09526061359793,
                    lon: 8.543951008468866,
                  },
                  count: 93,
                },
              },
              {
                key_as_string: "2024-01-07T00:00:00.000Z",
                key: 1704585600000,
                doc_count: 92,
                location: {
                  location: {
                    lat: 55.09526061359793,
                    lon: 8.543951008468866,
                  },
                  count: 92,
                },
              },
              {
                key_as_string: "2024-01-08T00:00:00.000Z",
                key: 1704672000000,
                doc_count: 92,
                location: {
                  location: {
                    lat: 55.09526061359793,
                    lon: 8.543951008468866,
                  },
                  count: 92,
                },
              },
              {
                key_as_string: "2024-01-09T00:00:00.000Z",
                key: 1704758400000,
                doc_count: 92,
                location: {
                  location: {
                    lat: 55.09526061359793,
                    lon: 8.543951008468866,
                  },
                  count: 92,
                },
              },
              {
                key_as_string: "2024-01-10T00:00:00.000Z",
                key: 1704844800000,
                doc_count: 92,
                location: {
                  location: {
                    lat: 55.09526061359793,
                    lon: 8.543951008468866,
                  },
                  count: 92,
                },
              },
              {
                key_as_string: "2024-01-11T00:00:00.000Z",
                key: 1704931200000,
                doc_count: 92,
                location: {
                  location: {
                    lat: 55.09526061359793,
                    lon: 8.543951008468866,
                  },
                  count: 92,
                },
              },
              {
                key_as_string: "2024-01-12T00:00:00.000Z",
                key: 1705017600000,
                doc_count: 92,
                location: {
                  location: {
                    lat: 55.09526061359793,
                    lon: 8.543951008468866,
                  },
                  count: 92,
                },
              },
              {
                key_as_string: "2024-01-13T00:00:00.000Z",
                key: 1705104000000,
                doc_count: 92,
                location: {
                  location: {
                    lat: 55.09526061359793,
                    lon: 8.543951008468866,
                  },
                  count: 92,
                },
              },
              {
                key_as_string: "2024-01-14T00:00:00.000Z",
                key: 1705190400000,
                doc_count: 92,
                location: {
                  location: {
                    lat: 55.09526061359793,
                    lon: 8.543951008468866,
                  },
                  count: 92,
                },
              },
              {
                key_as_string: "2024-01-15T00:00:00.000Z",
                key: 1705276800000,
                doc_count: 92,
                location: {
                  location: {
                    lat: 55.09526061359793,
                    lon: 8.543951008468866,
                  },
                  count: 92,
                },
              },
              {
                key_as_string: "2024-01-16T00:00:00.000Z",
                key: 1705363200000,
                doc_count: 92,
                location: {
                  location: {
                    lat: 55.09526061359793,
                    lon: 8.543951008468866,
                  },
                  count: 92,
                },
              },
              {
                key_as_string: "2024-01-17T00:00:00.000Z",
                key: 1705449600000,
                doc_count: 92,
                location: {
                  location: {
                    lat: 55.09526061359793,
                    lon: 8.543951008468866,
                  },
                  count: 92,
                },
              },
              {
                key_as_string: "2024-01-18T00:00:00.000Z",
                key: 1705536000000,
                doc_count: 92,
                location: {
                  location: {
                    lat: 55.09526061359793,
                    lon: 8.543951008468866,
                  },
                  count: 92,
                },
              },
              {
                key_as_string: "2024-01-19T00:00:00.000Z",
                key: 1705622400000,
                doc_count: 92,
                location: {
                  location: {
                    lat: 55.09526061359793,
                    lon: 8.543951008468866,
                  },
                  count: 92,
                },
              },
              {
                key_as_string: "2024-01-20T00:00:00.000Z",
                key: 1705708800000,
                doc_count: 92,
                location: {
                  location: {
                    lat: 55.09526061359793,
                    lon: 8.543951008468866,
                  },
                  count: 92,
                },
              },
              {
                key_as_string: "2024-01-21T00:00:00.000Z",
                key: 1705795200000,
                doc_count: 92,
                location: {
                  location: {
                    lat: 55.09526061359793,
                    lon: 8.543951008468866,
                  },
                  count: 92,
                },
              },
              {
                key_as_string: "2024-01-22T00:00:00.000Z",
                key: 1705881600000,
                doc_count: 92,
                location: {
                  location: {
                    lat: 55.09526061359793,
                    lon: 8.543951008468866,
                  },
                  count: 92,
                },
              },
              {
                key_as_string: "2024-01-23T00:00:00.000Z",
                key: 1705968000000,
                doc_count: 92,
                location: {
                  location: {
                    lat: 55.09526061359793,
                    lon: 8.543951008468866,
                  },
                  count: 92,
                },
              },
              {
                key_as_string: "2024-01-24T00:00:00.000Z",
                key: 1706054400000,
                doc_count: 92,
                location: {
                  location: {
                    lat: 55.09526061359793,
                    lon: 8.543951008468866,
                  },
                  count: 92,
                },
              },
              {
                key_as_string: "2024-01-25T00:00:00.000Z",
                key: 1706140800000,
                doc_count: 92,
                location: {
                  location: {
                    lat: 55.09526061359793,
                    lon: 8.543951008468866,
                  },
                  count: 92,
                },
              },
              {
                key_as_string: "2024-01-26T00:00:00.000Z",
                key: 1706227200000,
                doc_count: 92,
                location: {
                  location: {
                    lat: 55.09526061359793,
                    lon: 8.543951008468866,
                  },
                  count: 92,
                },
              },
              {
                key_as_string: "2024-01-27T00:00:00.000Z",
                key: 1706313600000,
                doc_count: 92,
                location: {
                  location: {
                    lat: 55.09526061359793,
                    lon: 8.543951008468866,
                  },
                  count: 92,
                },
              },
              {
                key_as_string: "2024-01-28T00:00:00.000Z",
                key: 1706400000000,
                doc_count: 92,
                location: {
                  location: {
                    lat: 55.09526061359793,
                    lon: 8.543951008468866,
                  },
                  count: 92,
                },
              },
              {
                key_as_string: "2024-01-29T00:00:00.000Z",
                key: 1706486400000,
                doc_count: 92,
                location: {
                  location: {
                    lat: 55.09526061359793,
                    lon: 8.543951008468866,
                  },
                  count: 92,
                },
              },
              {
                key_as_string: "2024-01-30T00:00:00.000Z",
                key: 1706572800000,
                doc_count: 91,
                location: {
                  location: {
                    lat: 55.09526061359793,
                    lon: 8.543951008468866,
                  },
                  count: 91,
                },
              },
            ],
          },
        },
      ],
    },
  },
};
