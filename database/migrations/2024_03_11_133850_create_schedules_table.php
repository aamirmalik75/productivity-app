<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
  /**
   * Run the migrations.
   *
   * @return void
   */
  public function up()
  {
    Schema::create('schedules', function (Blueprint $table) {
      $table->id();
      $table->unsignedBigInteger('user_id');
      $table->unsignedBigInteger('template_id');
      $table->string('title')->nullable();
      $table->date('date');
      $table->time('start');
      $table->time('end');
      $table->string('day');
      $table->unsignedBigInteger('week');
      $table->string('month');
      $table->unsignedBigInteger('year');
      $table->string('status')->default('incomplete');
      $table->boolean('isVerified')->default(0);
      $table->timestamps();

      $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
      $table->foreign('template_id')->references('id')->on('schedule_templates')->onDelete('cascade');
    });
  }

  /**
   * Reverse the migrations.
   *
   * @return void
   */
  public function down()
  {
    Schema::dropIfExists('schedules');
  }
};
