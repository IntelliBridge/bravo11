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

package updatetransform

import (
	"github.com/elastic/go-elasticsearch/v8/typedapi/types"
)

// Response holds the response body struct for the package updatetransform
//
// https://github.com/elastic/elasticsearch-specification/blob/17ac39c7f9266bc303baa029f90194aecb1c3b7c/specification/transform/update_transform/UpdateTransformResponse.ts#L33-L51
type Response struct {
	Authorization   *types.TransformAuthorization   `json:"authorization,omitempty"`
	CreateTime      int64                           `json:"create_time"`
	Description     string                          `json:"description"`
	Dest            types.ReindexDestination        `json:"dest"`
	Frequency       types.Duration                  `json:"frequency,omitempty"`
	Id              string                          `json:"id"`
	Latest          *types.Latest                   `json:"latest,omitempty"`
	Meta_           types.Metadata                  `json:"_meta,omitempty"`
	Pivot           *types.Pivot                    `json:"pivot,omitempty"`
	RetentionPolicy *types.RetentionPolicyContainer `json:"retention_policy,omitempty"`
	Settings        types.Settings                  `json:"settings"`
	Source          types.ReindexSource             `json:"source"`
	Sync            *types.SyncContainer            `json:"sync,omitempty"`
	Version         string                          `json:"version"`
}

// NewResponse returns a Response
func NewResponse() *Response {
	r := &Response{}
	return r
}