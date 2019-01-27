package com.smart.taskmaster.cucumber.stepdefs;

import com.smart.taskmaster.TaskMasterApp;

import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.web.WebAppConfiguration;
import org.springframework.test.web.servlet.ResultActions;

import org.springframework.boot.test.context.SpringBootTest;

@WebAppConfiguration
@SpringBootTest
@ContextConfiguration(classes = TaskMasterApp.class)
public abstract class StepDefs {

    protected ResultActions actions;

}
