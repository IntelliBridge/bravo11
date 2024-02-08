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

package puttrainedmodeldefinitionpart

import (
	"encoding/json"
	"fmt"
)

// Request holds the request body struct for the package puttrainedmodeldefinitionpart
//
// https://github.com/elastic/elasticsearch-specification/blob/17ac39c7f9266bc303baa029f90194aecb1c3b7c/specification/ml/put_trained_model_definition_part/MlPutTrainedModelDefinitionPartRequest.ts#L24-L57
type Request struct {

	// Definition The definition part for the model. Must be a base64 encoded string.
	Definition string `json:"definition"`
	// TotalDefinitionLength The total uncompressed definition length in bytes. Not base64 encoded.
	TotalDefinitionLength int64 `json:"total_definition_length"`
	// TotalParts The total number of parts that will be uploaded. Must be greater than 0.
	TotalParts int `json:"total_parts"`
}

// NewRequest returns a Request
func NewRequest() *Request {
	r := &Request{}
	return r
}

// FromJSON allows to load an arbitrary json into the request structure
func (r *Request) FromJSON(data string) (*Request, error) {
	var req Request
	err := json.Unmarshal([]byte(data), &req)

	if err != nil {
		return nil, fmt.Errorf("could not deserialise json into Puttrainedmodeldefinitionpart request: %w", err)
	}

	return &req, nil
}
