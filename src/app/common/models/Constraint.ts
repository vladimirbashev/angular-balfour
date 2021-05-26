import { Validator, Validators } from '@angular/forms';
export class Constraint {
    name: Constraints;
    values?: { [key: string]: any };
}

export enum Constraints {
    MaxLength = 'MaxLength',
    MaxLengthIfGreek = 'MaxLengthIfGreek',
    RequiredField = 'RequiredField',
    ShowIfParentSelectionIs = 'ShowIfParentSelectionIs',
    ShowIfQuestionSelectionIs = 'ShowIfQuestionSelectionIs',
    RequiredIfVisible = 'RequiredIfVisible',
    GuaranteeText = 'GuaranteeText',
    ShowPartsIfQuestionSelectionIs = 'ShowPartsIfQuestionSelectionIs',
    ValidateField = 'ValidateField',
    ForceUppercase = 'ForceUppercase',
    HideIfQuestionSelectionIs = 'HideIfQuestionSelectionIs',
    HideOnPartSpecialType = 'HideOnPartSpecialType',
    ValidateAlpha = 'ValidateAlpha',
    ValidateDigits = 'ValidateDigits',
    ProfanityCheck = 'ProfanityCheck',
    HidePartsIfQuestionSelectionIs = 'HidePartsIfQuestionSelectionIs',
    ValidateAlphaNum = 'ValidateAlphaNum',
    ValidateAlphaNumAll = 'ValidateAlphaNumAll',
    ValidateAlphaNumPunctuation = 'ValidateAlphaNumPunctuation',
    ValidateUpperCase = 'ValidateUpperCase',
    ShowIfQuestionSelectionTextIs = 'ShowIfQuestionSelectionTextIs',
    OnlyHideIfQuestionSelectionTextIsNot = 'OnlyHideIfQuestionSelectionTextIsNot',
    RequiredIfQuestionSelectionIs = 'RequiredIfQuestionSelectionIs',
    ShowIfParentIsAnswered = 'ShowIfParentIsAnswered',
    // additional constraints
    SchoolFinderMascot = 'SchoolFinderMascot'
}

export enum ConstraintArea {
    FieldValidator = 'field_validator',
    FormValidator = 'form_validator',
    Undefined = 'undefined'
}

export enum ConstraintFormlyArea {
    HideExpression = 'hideExpression',
    MaxLength = 'templateOptions.maxLength',
    Validators = 'validators',
    Required = 'templateOptions.required',
    Hooks = 'hooks',
    Undefined = 'undefined'
}

export const constraintsAreas: { [constraint in Constraints]: ConstraintArea } = {
    [Constraints.MaxLength]: ConstraintArea.FieldValidator,
    [Constraints.MaxLengthIfGreek]: ConstraintArea.FieldValidator,
    [Constraints.RequiredField]: ConstraintArea.FieldValidator,
    [Constraints.ShowIfParentSelectionIs]: ConstraintArea.FormValidator,
    [Constraints.ShowIfQuestionSelectionIs]: ConstraintArea.FormValidator,
    [Constraints.RequiredIfVisible]: ConstraintArea.FormValidator,
    [Constraints.GuaranteeText]: ConstraintArea.Undefined,
    [Constraints.ShowPartsIfQuestionSelectionIs]: ConstraintArea.FormValidator,
    [Constraints.ValidateField]: ConstraintArea.FieldValidator,
    [Constraints.ForceUppercase]: ConstraintArea.FieldValidator,
    [Constraints.HideIfQuestionSelectionIs]: ConstraintArea.FormValidator,
    [Constraints.HideOnPartSpecialType]: ConstraintArea.FormValidator,
    [Constraints.ValidateAlpha]: ConstraintArea.FieldValidator,
    [Constraints.ValidateDigits]: ConstraintArea.FieldValidator,
    [Constraints.ProfanityCheck]: ConstraintArea.FieldValidator,
    [Constraints.HidePartsIfQuestionSelectionIs]: ConstraintArea.FormValidator,
    [Constraints.ValidateAlphaNum]: ConstraintArea.FieldValidator,
    [Constraints.ValidateAlphaNumAll]: ConstraintArea.FieldValidator,
    [Constraints.ValidateAlphaNumPunctuation]: ConstraintArea.FieldValidator,
    [Constraints.ValidateUpperCase]: ConstraintArea.FieldValidator,
    [Constraints.ShowIfQuestionSelectionTextIs]: ConstraintArea.FormValidator,
    [Constraints.OnlyHideIfQuestionSelectionTextIsNot]: ConstraintArea.FormValidator,
    [Constraints.RequiredIfQuestionSelectionIs]: ConstraintArea.FormValidator,
    [Constraints.ShowIfParentIsAnswered]: ConstraintArea.FormValidator,
    [Constraints.SchoolFinderMascot]: ConstraintArea.FormValidator
};

export const constraintsFormlyAreas: { [constraint in Constraints]: ConstraintFormlyArea } = {
    [Constraints.MaxLength]: ConstraintFormlyArea.MaxLength,
    [Constraints.MaxLengthIfGreek]: ConstraintFormlyArea.Validators,
    [Constraints.RequiredField]: ConstraintFormlyArea.Required,
    [Constraints.ShowIfParentSelectionIs]: ConstraintFormlyArea.HideExpression,
    [Constraints.ShowIfQuestionSelectionIs]: ConstraintFormlyArea.HideExpression,
    [Constraints.RequiredIfVisible]: ConstraintFormlyArea.Validators,
    [Constraints.GuaranteeText]: ConstraintFormlyArea.Undefined,
    [Constraints.ShowPartsIfQuestionSelectionIs]: ConstraintFormlyArea.Hooks,
    [Constraints.ValidateField]: ConstraintFormlyArea.Undefined,
    [Constraints.ForceUppercase]: ConstraintFormlyArea.Undefined,
    [Constraints.HideIfQuestionSelectionIs]: ConstraintFormlyArea.HideExpression,
    [Constraints.HideOnPartSpecialType]: ConstraintFormlyArea.HideExpression,
    [Constraints.ValidateAlpha]: ConstraintFormlyArea.Validators,
    [Constraints.ValidateDigits]: ConstraintFormlyArea.Validators,
    [Constraints.ProfanityCheck]: ConstraintFormlyArea.Validators,
    [Constraints.HidePartsIfQuestionSelectionIs]: ConstraintFormlyArea.Hooks,
    [Constraints.ValidateAlphaNum]: ConstraintFormlyArea.Validators,
    [Constraints.ValidateAlphaNumAll]: ConstraintFormlyArea.Validators,
    [Constraints.ValidateAlphaNumPunctuation]: ConstraintFormlyArea.Validators,
    [Constraints.ValidateUpperCase]: ConstraintFormlyArea.Validators,
    [Constraints.ShowIfQuestionSelectionTextIs]: ConstraintFormlyArea.HideExpression,
    [Constraints.OnlyHideIfQuestionSelectionTextIsNot]: ConstraintFormlyArea.HideExpression,
    [Constraints.RequiredIfQuestionSelectionIs]: ConstraintFormlyArea.Required,
    [Constraints.ShowIfParentIsAnswered]: ConstraintFormlyArea.HideExpression,
    [Constraints.SchoolFinderMascot]: ConstraintFormlyArea.Undefined
};

export class FragmentFormConstraints {
    [groupId: string]: {
        [questionId: string]: Constraint[]
    };
}
