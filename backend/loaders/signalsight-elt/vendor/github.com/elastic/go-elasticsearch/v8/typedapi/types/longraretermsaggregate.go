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
)

// LongRareTermsAggregate type.
//
// https://github.com/elastic/elasticsearch-specification/blob/17ac39c7f9266bc303baa029f90194aecb1c3b7c/specification/_types/aggregations/Aggregate.ts#L431-L436
type LongRareTermsAggregate struct {
	Buckets BucketsLongRareTermsBucket `json:"buckets"`
	Meta    Metadata                   `json:"meta,omitempty"`
}

func (s *LongRareTermsAggregate) UnmarshalJSON(data []byte) error {

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

		case "buckets":

			rawMsg := json.RawMessage{}
			dec.Decode(&rawMsg)
			source := bytes.NewReader(rawMsg)
			localDec := json.NewDecoder(source)
			switch rawMsg[0] {
			case '{':
				o := make(map[string]LongRareTermsBucket, 0)
				if err := localDec.Decode(&o); err != nil {
					return err
				}
				s.Buckets = o
			case '[':
				o := []LongRareTermsBucket{}
				if err := localDec.Decode(&o); err != nil {
					return err
				}
				s.Buckets = o
			}

		case "meta":
			if err := dec.Decode(&s.Meta); err != nil {
				return err
			}

		}
	}
	return nil
}

// NewLongRareTermsAggregate returns a LongRareTermsAggregate.
func NewLongRareTermsAggregate() *LongRareTermsAggregate {
	r := &LongRareTermsAggregate{}

	return r
}