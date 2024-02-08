package models

type DocumentSource interface {
  ToDocument() any
}
