<?php

use App\Models\User;

test('guests are redirected to the login page', function () {
    $this->get(route('dashboard'))->assertRedirect(route('login'));
});

test('authenticated attendees are redirected to attendee dashboard', function () {
    $this->actingAs($user = User::factory()->create(['role' => 'attendee']));

    $this->get(route('dashboard'))->assertRedirect(route('attendee.dashboard'));
});

test('authenticated admins are redirected to finance dashboard', function () {
    $this->actingAs($user = User::factory()->create(['role' => 'admin']));

    $this->get(route('dashboard'))->assertRedirect(route('admin.finance.dashboard'));
});

test('authenticated teachers are redirected to teacher dashboard', function () {
    $this->actingAs($user = User::factory()->create(['role' => 'teacher']));

    $this->get(route('dashboard'))->assertRedirect(route('teacher.dashboard'));
});