// Licensed to Elasticsearch B.V. under one or more contributor
// license agreements. See the NOTICE file distributed with
// this work for additional information regarding copyright
// ownership. Elasticsearch B.V. licenses this file to you under
// the Apache License, Version 2.0 (the "License"); you may
// not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//    http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing,
// software distributed under the License is distributed on an
// "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
// KIND, either express or implied.  See the License for the
// specific language governing permissions and limitations
// under the License.

// Code generated from the elasticsearch-specification DO NOT EDIT.
// https://github.com/elastic/elasticsearch-specification/tree/17ac39c7f9266bc303baa029f90194aecb1c3b7c

package types

import (
	"bytes"
	"encoding/json"
	"errors"
	"io"
	"strconv"

	"github.com/elastic/go-elasticsearch/v8/typedapi/types/enums/childscoremode"
)

// NestedQuery type.
//
// https://github.com/elastic/elasticsearch-specification/blob/17ac39c7f9266bc303baa029f90194aecb1c3b7c/specification/_types/query_dsl/joining.ts#L106-L130
type NestedQuery struct {
	// Boost Floating point number used to decrease or increase the relevance scores of
	// the query.
	// Boost values are relative to the default value of 1.0.
	// A boost value between 0 and 1.0 decreases the relevance score.
	// A value greater than 1.0 increases the relevance score.
	Boost *float32 `json:"boost,omitempty"`
	// IgnoreUnmapped Indicates whether to ignore an unmapped path and not return any documents
	// instead of an error.
	IgnoreUnmapped *bool `json:"ignore_unmapped,omitempty"`
	// InnerHits If defined, each search hit will contain inner hits.
	InnerHits *InnerHits `json:"inner_hits,omitempty"`
	// Path Path to the nested object you wish to search.
	Path string `json:"path"`
	// Query Query you wish to run on nested objects in the path.
	Query      *Query  `json:"query,omitempty"`
	QueryName_ *string `json:"_name,omitempty"`
	// ScoreMode How scores for matching child objects affect the root parent document’s
	// relevance score.
	ScoreMode *childscoremode.ChildScoreMode `json:"score_mode,omitempty"`
}

func (s *NestedQuery) UnmarshalJSON(data []byte) error {

	dec := json.NewDecoder(bytes.NewReader(data))

	for {
		t, err := dec.Token()
		if err != nil {
			if errors.Is(err, io.EOF) {
				break
			}
			return err
		}

		switch t {

		case "boost":
			var tmp interface{}
			dec.Decode(&tmp)
			switch v := tmp.(type) {
			case string:
				value, err := strconv.ParseFloat(v, 32)
				if err != nil {
					return err
				}
				f := float32(value)
				s.Boost = &f
			case float64:
				f := float32(v)
				s.Boost = &f
			}

		case "ignore_unmapped":
			var tmp interface{}
			dec.Decode(&tmp)
			switch v := tmp.(type) {
			case string:
				value, err := strconv.ParseBool(v)
				if err != nil {
					return err
				}
				s.IgnoreUnmapped = &value
			case bool:
				s.IgnoreUnmapped = &v
			}

		case "inner_hits":
			if err := dec.Decode(&s.InnerHits); err != nil {
				return err
			}

		case "path":
			if err := dec.Decode(&s.Path); err != nil {
				return err
			}

		case "query":
			if err := dec.Decode(&s.Query); err != nil {
				return err
			}

		case "_name":
			var tmp json.RawMessage
			if err := dec.Decode(&tmp); err != nil {
				return err
			}
			o := string(tmp[:])
			o, err = strconv.Unquote(o)
			if err != nil {
				o = string(tmp[:])
			}
			s.QueryName_ = &o

		case "score_mode":
			if err := dec.Decode(&s.ScoreMode); err != nil {
				return err
			}

		}
	}
	return nil
}

// NewNestedQuery returns a NestedQuery.
func NewNestedQuery() *NestedQuery {
	r := &NestedQuery{}

	return r
}
